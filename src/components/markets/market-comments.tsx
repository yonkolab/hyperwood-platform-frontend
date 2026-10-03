import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Bookmark,
	CornerDownRight,
	Heart,
	Link2,
	Loader2,
	MoreHorizontal,
	Reply,
	Send,
	ShieldAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import {
	createMarketComment,
	getMarketComments,
	type MarketCommentNode,
	reportMarketComment,
	toggleMarketCommentBookmark,
	toggleMarketCommentLike,
} from "#/features/markets/server";
import { formatApiError } from "#/lib/api/errors";
import type { User } from "#/lib/api/types";

function formatCommentTimeAgo(iso: string) {
	const diffMs = Date.now() - new Date(iso).getTime();
	const minutes = Math.floor(diffMs / 60000);

	if (minutes < 1) {
		return "agora";
	}

	if (minutes < 60) {
		return `há ${minutes} min`;
	}

	const hours = Math.floor(minutes / 60);

	if (hours < 24) {
		return `há ${hours}h`;
	}

	const days = Math.floor(hours / 24);

	return `há ${days}d`;
}

function authorLabel(comment: MarketCommentNode) {
	return comment.author.username ?? comment.author.email;
}

function CommentMenu(props: { comment: MarketCommentNode }) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const reportMutation = useMutation({
		mutationFn: async () =>
			reportMarketComment({
				data: {
					commentId: props.comment.id,
					reason: "conteúdo impróprio",
				},
			}),
		onSuccess: () => {
			setOpen(false);
			toast.success("Comentário reportado. Nossa equipe vai analisar.");
			queryClient.invalidateQueries({
				queryKey: ["markets", props.comment.marketId, "comments"],
			});
		},
		onError: (error) => {
			toast.error(formatApiError(error));
		},
	});

	return (
		<div className="relative">
			<Button
				variant="ghost"
				size="icon"
				aria-label="Mais opções"
				onClick={() => {
					setOpen((value) => !value);
				}}
			>
				<MoreHorizontal className="size-4" />
			</Button>
			{open ? (
				<div className="absolute right-0 top-10 z-10 w-44 overflow-hidden rounded-lg border border-edge bg-card py-1 shadow-[0_8px_24px_rgba(13,31,23,0.12)]">
					<button
						type="button"
						className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition hover:bg-subtle"
						onClick={() => {
							reportMutation.mutate();
						}}
					>
						<ShieldAlert className="size-4 text-no" />
						{reportMutation.isPending ? "Reportando..." : "Reportar comentário"}
					</button>
				</div>
			) : null}
		</div>
	);
}

function CommentComposer(props: {
	marketId: string;
	parentId?: string;
	placeholder: string;
	user: User | null;
	onSubmitted: () => void;
	onCancel?: () => void;
	compact?: boolean;
}) {
	const [body, setBody] = useState("");
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async () =>
			createMarketComment({
				data: {
					marketId: props.marketId,
					body,
					...(props.parentId ? { parentId: props.parentId } : {}),
				},
			}),
		onSuccess: () => {
			setBody("");
			props.onSubmitted();
			if (!props.parentId) {
				toast.success("Comentário publicado.");
			}
		},
		onError: (error) => {
			toast.error(formatApiError(error));
		},
	});

	if (!props.user) {
		return (
			<p className="text-sm text-muted">
				Entre na sua conta para participar da discussão.
			</p>
		);
	}

	return (
		<form
			className={props.compact ? "mt-3 space-y-2" : "space-y-3"}
			onSubmit={(event) => {
				event.preventDefault();
				if (body.trim().length > 0) {
					mutation.mutate();
				}
			}}
		>
			<Input
				value={body}
				placeholder={props.placeholder}
				maxLength={2000}
				onChange={(event) => {
					setBody(event.target.value);
				}}
			/>
			<div className="flex justify-end gap-2">
				{props.onCancel ? (
					<Button
						type="button"
						variant="ghost"
						onClick={() => {
							props.onCancel?.();
						}}
					>
						Cancelar
					</Button>
				) : null}
				<Button type="submit" disabled={mutation.isPending || !body.trim()}>
					{mutation.isPending ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						<Send className="size-4" />
					)}
					Comentar
				</Button>
			</div>
		</form>
	);
}

function CommentItem(props: {
	comment: MarketCommentNode;
	marketId: string;
	user: User | null;
	depth?: number;
}) {
	const [collapsed, setCollapsed] = useState(false);
	const [replying, setReplying] = useState(false);
	const queryClient = useQueryClient();
	const comment = props.comment;
	const commentUrl = `${window.location.origin}/markets/${comment.marketId}#comment-${comment.id}`;

	const likeMutation = useMutation({
		mutationFn: async () =>
			toggleMarketCommentLike({ data: { commentId: comment.id } }),
		onSuccess: (result) => {
			queryClient.setQueriesData<{ comments: MarketCommentNode[] }>(
				{ queryKey: ["markets", props.marketId, "comments"] },
				(cache) =>
					updateCommentInTree(cache, comment.id, (node) => ({
						...node,
						likeCount: result.likeCount,
						viewer: { ...node.viewer, liked: result.liked },
					})),
			);
		},
		onError: (error) => {
			toast.error(formatApiError(error));
		},
	});

	const bookmarkMutation = useMutation({
		mutationFn: async () =>
			toggleMarketCommentBookmark({ data: { commentId: comment.id } }),
		onSuccess: (result) => {
			queryClient.setQueriesData<{ comments: MarketCommentNode[] }>(
				{ queryKey: ["markets", props.marketId, "comments"] },
				(cache) =>
					updateCommentInTree(cache, comment.id, (node) => ({
						...node,
						viewer: { ...node.viewer, bookmarked: result.bookmarked },
					})),
			);
		},
		onError: (error) => {
			toast.error(formatApiError(error));
		},
	});

	const invalidate = () => {
		queryClient.invalidateQueries({
			queryKey: ["markets", props.marketId, "comments"],
		});
	};

	return (
		<div
			id={`comment-${comment.id}`}
			className={props.depth && props.depth > 0 ? "space-y-2" : "space-y-2"}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex min-w-0 items-center gap-2 text-sm">
					<span className="truncate font-semibold text-foreground">
						{authorLabel(comment)}
					</span>
					<span className="shrink-0 text-xs text-muted">
						{formatCommentTimeAgo(comment.createdAt)}
					</span>
				</div>
				<CommentMenu comment={comment} />
			</div>
			<p className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
				{comment.body}
			</p>
			<div className="flex flex-wrap items-center gap-1">
				<Button
					variant="ghost"
					size="sm"
					className="gap-1.5"
					aria-pressed={comment.viewer.liked}
					onClick={() => {
						likeMutation.mutate();
					}}
				>
					<Heart
						className={`size-4 ${comment.viewer.liked ? "fill-no text-no" : ""}`}
					/>
					{comment.likeCount > 0 ? comment.likeCount : ""}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="gap-1.5"
					aria-pressed={comment.viewer.bookmarked}
					onClick={() => {
						bookmarkMutation.mutate();
					}}
				>
					<Bookmark
						className={`size-4 ${comment.viewer.bookmarked ? "fill-brand text-brand" : ""}`}
					/>
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="gap-1.5"
					onClick={() => {
						navigator.clipboard
							.writeText(commentUrl)
							.then(() => {
								toast.success("Link do comentário copiado.");
							})
							.catch(() => {
								toast.error("Não foi possível copiar o link.");
							});
					}}
				>
					<Link2 className="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="gap-1.5"
					onClick={() => {
						setReplying((value) => !value);
					}}
				>
					<Reply className="size-4" />
					Responder
				</Button>
			</div>

			{replying ? (
				<CommentComposer
					marketId={props.marketId}
					parentId={comment.id}
					placeholder="Escreva sua resposta..."
					user={props.user}
					onSubmitted={() => {
						setReplying(false);
						invalidate();
					}}
					onCancel={() => {
						setReplying(false);
					}}
					compact
				/>
			) : null}

			{comment.replies.length > 0 ? (
				<div className="ml-4 border-l-2 border-edge pl-4">
					<button
						type="button"
						className="flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-foreground"
						onClick={() => {
							setCollapsed((value) => !value);
						}}
					>
						{collapsed ? <CornerDownRight className="size-3.5" /> : null}
						{collapsed
							? `Mostrar ${comment.replies.length} ${comment.replies.length === 1 ? "resposta" : "respostas"}`
							: `Ocultar ${comment.replies.length} ${comment.replies.length === 1 ? "resposta" : "respostas"}`}
					</button>
					{collapsed ? null : (
						<div className="mt-3 space-y-4">
							{comment.replies.map((reply) => (
								<CommentItem
									key={reply.id}
									comment={reply}
									marketId={props.marketId}
									user={props.user}
									depth={(props.depth ?? 0) + 1}
								/>
							))}
						</div>
					)}
				</div>
			) : null}
		</div>
	);
}

function updateCommentInTree(
	cache: { comments: MarketCommentNode[] } | undefined,
	commentId: string,
	updater: (node: MarketCommentNode) => MarketCommentNode,
): { comments: MarketCommentNode[] } | undefined {
	if (!cache) {
		return cache;
	}

	const walk = (nodes: MarketCommentNode[]): MarketCommentNode[] =>
		nodes.map((node) =>
			node.id === commentId
				? updater(node)
				: { ...node, replies: walk(node.replies) },
		);

	return { ...cache, comments: walk(cache.comments) };
}

export function MarketComments(props: { marketId: string; user: User | null }) {
	const queryClient = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: ["markets", props.marketId, "comments"],
		queryFn: () => getMarketComments({ data: { marketId: props.marketId } }),
	});
	const commentCount = countComments(data?.comments ?? []);
	const sectionRef = useRef<HTMLDivElement>(null);

	const invalidateComments = () => {
		queryClient.invalidateQueries({
			queryKey: ["markets", props.marketId, "comments"],
		});
	};

	useEffect(() => {
		const anchor = window.location.hash;

		if (anchor.startsWith("#comment-") && sectionRef.current) {
			sectionRef.current
				.querySelector(anchor)
				?.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [data]);

	return (
		<div ref={sectionRef}>
			<Card className="p-6">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold text-foreground">Comentários</h2>
					<Badge>{commentCount}</Badge>
				</div>

				<div className="mt-4 border-b border-edge pb-6">
					<CommentComposer
						marketId={props.marketId}
						placeholder="Compartilhe sua análise deste mercado..."
						user={props.user}
						onSubmitted={invalidateComments}
					/>
				</div>

				{isLoading ? (
					<div className="flex justify-center py-10 text-muted">
						<Loader2 className="size-5 animate-spin" />
					</div>
				) : commentCount === 0 ? (
					<p className="py-10 text-center text-sm text-muted">
						Nenhum comentário ainda. Seja o primeiro a opinar.
					</p>
				) : (
					<div className="mt-6 space-y-6">
						{(data?.comments ?? []).map((comment) => (
							<CommentItem
								key={comment.id}
								comment={comment}
								marketId={props.marketId}
								user={props.user}
							/>
						))}
					</div>
				)}
			</Card>
		</div>
	);
}

function countComments(comments: MarketCommentNode[]): number {
	return comments.reduce(
		(total, comment) => total + 1 + countComments(comment.replies),
		0,
	);
}
