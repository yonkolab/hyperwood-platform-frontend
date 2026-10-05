import { Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "#/components/ui/card";
import type { MarketListResponse, MarketRecord } from "#/lib/api/types";
import {
	formatCompactNumber,
	formatPriceBps,
	formatRelativeCountdown,
} from "#/lib/format";

const FAVORITES_KEY = "hw-favorites";
const ELECTION_ACTIVE_CANDIDATES = new Set([
	"eleicoes-2026-flavio-eleito",
	"eleicoes-2026-lula-reeleito",
]);

function loadFavorites(): string[] {
	if (typeof window === "undefined") {
		return [];
	}

	try {
		return JSON.parse(
			window.localStorage.getItem(FAVORITES_KEY) ?? "[]",
		) as string[];
	} catch {
		return [];
	}
}

function useFavorites() {
	const [favorites, setFavorites] = useState<string[]>(loadFavorites);

	useEffect(() => {
		window.dispatchEvent(new Event("hw-favorites-sync"));
	}, [favorites]);

	return { favorites, setFavorites };
}

function toggleFavorite(
	id: string,
	favorites: string[],
	setFavorites: (next: string[]) => void,
) {
	const next = favorites.includes(id)
		? favorites.filter((entry) => entry !== id)
		: [...favorites, id];

	setFavorites(next);

	try {
		window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
	} catch {
		toast.error("Não foi possível salvar o favorito.");
	}
}

function initials(text: string) {
	return text
		.replace(/[^a-zA-ZÀ-ú0-9 ]/g, "")
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase()
		.slice(0, 3);
}

function shortSideName(title: string) {
	return title
		.replace(/ vence.*$/i, "")
		.replace(/ termina.*$/i, "")
		.replace(/ será campeão.*$/i, "")
		.replace(/\?$/, "")
		.slice(0, 22);
}

function EventBookmark({ marketId }: { marketId: string }) {
	const { favorites, setFavorites } = useFavorites();
	const bookmarked = favorites.includes(marketId);

	return (
		<button
			type="button"
			aria-label={bookmarked ? "Remover dos favoritos" : "Salvar nos favoritos"}
			aria-pressed={bookmarked}
			className={`flex size-8 items-center justify-center rounded-full transition hover:bg-subtle ${
				bookmarked ? "text-brand" : "text-muted hover:text-foreground"
			}`}
			onClick={(event) => {
				event.preventDefault();
				event.stopPropagation();
				toggleFavorite(marketId, favorites, setFavorites);
			}}
		>
			<Bookmark className={`size-4 ${bookmarked ? "fill-brand" : ""}`} />
		</button>
	);
}

function EventFooter(props: { volumeMinor: number; category: string }) {
	const [closeText, setCloseText] = useState("2d");

	useEffect(() => {
		const closesAt = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString();
		setCloseText(formatRelativeCountdown(closesAt));
	}, []);

	return (
		<div className="mt-auto flex items-center justify-between gap-3 border-t border-edge px-5 py-2.5 text-xs text-muted">
			<span className="inline-flex items-center gap-1.5 font-medium text-no">
				<span className="relative flex size-2 shrink-0 items-center justify-center">
					<span className="absolute inline-flex size-full animate-ping rounded-full bg-[#df0c10] opacity-70" />
					<span className="relative inline-flex size-2 rounded-full bg-[#df0c10]" />
				</span>
				Ao vivo
			</span>
			<span className="inline-flex items-center gap-1 text-[11px] lg:text-xs">
				<span>{formatCompactNumber(props.volumeMinor / 100)} Vol.</span>
				<span aria-hidden>·</span>
				<span>{props.category}</span>
				<span className="hidden sm:inline" aria-hidden>
					·
				</span>
				<span className="hidden sm:inline">{closeText}</span>
			</span>
		</div>
	);
}

function EventCardMatchup(props: { eventId: string; markets: MarketRecord[] }) {
	return (
		<>
			<div className="flex flex-1 flex-col justify-between p-5 pb-3">
				{props.markets.map((market) => (
					<div
						key={market.id}
						className="mb-4 flex items-center justify-between gap-3 last:mb-0"
					>
						<div className="flex min-w-0 items-center gap-3">
							<span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-soft text-[10px] font-black text-brand">
								{initials(shortSideName(market.title))}
							</span>
							<span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
								{shortSideName(market.title)}
							</span>
						</div>
						<span className="text-lg font-bold tabular-nums text-foreground">
							{formatPriceBps(market.yesPriceBps)}
						</span>
					</div>
				))}
			</div>
			<div className="grid grid-cols-2 gap-3 px-5 pb-5">
				{props.markets.map((market) => (
					<Link
						key={market.id}
						to="/markets/$marketId"
						params={{ marketId: market.id }}
						className="flex h-10 items-center justify-center rounded-lg bg-no-soft px-3 text-sm font-bold text-no transition hover:bg-no-soft/80"
					>
						{shortSideName(market.title)}
					</Link>
				))}
			</div>
		</>
	);
}

function EventCardRows(props: {
	eventSlug: string;
	eventTitle: string;
	category: string;
	markets: MarketRecord[];
	headlineId: string | null;
}) {
	return (
		<>
			<div className="flex items-start justify-between gap-3 p-5 pb-3">
				<div className="flex min-w-0 items-center gap-3">
					<span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-[10px] font-bold text-brand">
						{initials(props.eventTitle)}
					</span>
					<div className="min-w-0">
						<h3 className="line-clamp-1 text-[15px] font-semibold leading-tight text-foreground">
							{props.eventTitle}
						</h3>
						<p className="mt-0.5 text-xs text-muted">{props.category}</p>
					</div>
				</div>
				{props.headlineId ? (
					<EventBookmark marketId={props.headlineId} />
				) : null}
			</div>
			<ol className="divide-y divide-edge border-t border-edge">
				{props.markets.slice(0, 2).map((market) => (
					<li key={market.id}>
						<Link
							to="/markets/$marketId"
							params={{ marketId: market.id }}
							className="flex items-center justify-between gap-3 px-5 py-2.5 transition hover:bg-card/70"
						>
							<span className="min-w-0 flex-1 truncate text-sm text-foreground">
								{market.title}
							</span>
							<div className="flex items-center gap-2">
								<span className="text-sm font-semibold tabular-nums text-foreground">
									{formatPriceBps(market.yesPriceBps)}
								</span>
								<span className="inline-flex items-center gap-1">
									<span className="flex h-7 items-center rounded bg-yes-soft px-2 text-[11px] font-bold uppercase tracking-wide text-yes">
										Sim
									</span>
									<span className="flex h-7 items-center rounded bg-no-soft px-2 text-[11px] font-bold uppercase tracking-wide text-no">
										Não
									</span>
								</span>
							</div>
						</Link>
					</li>
				))}
			</ol>
			{props.eventSlug === "eleicoes-brasil-2026" ? (
				<div className="border-t border-edge px-5 py-3">
					<Link
						to="/events/brazil-presidential-election"
						className="text-sm font-semibold text-brand hover:underline"
					>
						Ver todos os resultados
					</Link>
				</div>
			) : null}
		</>
	);
}

export function EventCard(props: {
	event: MarketListResponse["eventGroups"][number];
	markets: MarketRecord[];
}) {
	const event = props.event;
	const markets = props.markets.filter(Boolean);

	if (markets.length === 0) {
		return null;
	}

	const volumeMinor = markets.reduce(
		(total, market) => total + market.volumeUsdMinor,
		0,
	);
	const headline =
		markets.find((market) => market.status === "active") ?? markets[0];
	const isMatchup = event.category === "Esportes";
	const cardMarkets =
		event.eventSlug === "eleicoes-brasil-2026"
			? [...markets].sort((left, right) => {
					const leftIsCandidate = ELECTION_ACTIVE_CANDIDATES.has(left.slug);
					const rightIsCandidate = ELECTION_ACTIVE_CANDIDATES.has(right.slug);

					if (leftIsCandidate !== rightIsCandidate) {
						return leftIsCandidate ? -1 : 1;
					}

					return right.yesPriceBps - left.yesPriceBps;
				})
			: markets;

	return (
		<Card className="flex h-full flex-col gap-0 overflow-hidden rounded-lg border-edge bg-card p-0 shadow-[0_1px_2px_rgba(13,31,23,0.05)] transition hover:border-brand/30 hover:shadow-[0_2px_12px_rgba(13,56,46,0.08)]">
			{isMatchup ? (
				<div className="flex h-full flex-col">
					<EventCardMatchup eventId={event.eventId} markets={markets} />
					<EventFooter volumeMinor={volumeMinor} category={event.category} />
				</div>
			) : (
				<div className="flex h-full flex-col">
					<EventCardRows
						eventSlug={event.eventSlug}
						eventTitle={event.eventTitle}
						category={event.category}
						markets={cardMarkets}
						headlineId={headline ? headline.id : null}
					/>
					<EventFooter volumeMinor={volumeMinor} category={event.category} />
				</div>
			)}
		</Card>
	);
}
