import { Card } from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";

function skeletonKeys(count: number) {
	return Array.from(
		{ length: count },
		(_, index) => `placeholder-${index + 1}`,
	);
}

function LoadingRegion({ children }: { children: React.ReactNode }) {
	return (
		<section
			aria-busy="true"
			aria-label="Carregando conteúdo"
			className="space-y-6"
		>
			<output className="sr-only">Carregando conteúdo…</output>
			{children}
		</section>
	);
}

function MetricSkeleton() {
	return (
		<Card className="space-y-3 p-5">
			<Skeleton className="h-3 w-24" />
			<Skeleton className="h-8 w-36" />
		</Card>
	);
}

function DataListCardSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<Card className="space-y-5 p-5">
			<Skeleton className="h-6 w-40" />
			<div className="space-y-3">
				{skeletonKeys(rows).map((key) => (
					<div
						key={key}
						className="flex items-center justify-between gap-4 rounded-lg border border-edge p-4"
					>
						<div className="min-w-0 flex-1 space-y-2">
							<Skeleton className="h-4 w-3/5" />
							<Skeleton className="h-3 w-2/5" />
						</div>
						<Skeleton className="h-5 w-16 shrink-0" />
					</div>
				))}
			</div>
		</Card>
	);
}

function HomeEventCardSkeleton() {
	return (
		<Card className="overflow-hidden p-0">
			<div className="space-y-4 p-5">
				<div className="flex items-center gap-3">
					<Skeleton className="size-9 rounded-full" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-3 w-1/3" />
					</div>
				</div>
				{skeletonKeys(3).map((key) => (
					<div key={key} className="flex items-center justify-between gap-3">
						<Skeleton className="h-4 w-2/3" />
						<Skeleton className="h-8 w-16 rounded-full" />
					</div>
				))}
			</div>
			<div className="border-t border-edge px-5 py-3">
				<Skeleton className="h-3 w-28" />
			</div>
		</Card>
	);
}

export function HomePageSkeleton() {
	return (
		<LoadingRegion>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
				<Skeleton className="hidden h-[480px] rounded-lg md:block" />
				<div className="hidden space-y-5 xl:block">
					<Skeleton className="h-56 rounded-lg" />
					<Skeleton className="h-56 rounded-lg" />
				</div>
			</div>
			<div className="space-y-5">
				<Skeleton className="h-20 rounded-lg" />
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{skeletonKeys(8).map((key) => (
						<HomeEventCardSkeleton key={key} />
					))}
				</div>
			</div>
		</LoadingRegion>
	);
}

export function MarketDetailSkeleton() {
	return (
		<LoadingRegion>
			<div className="space-y-3">
				<Skeleton className="h-5 w-24" />
				<Skeleton className="h-10 w-3/4" />
				<Skeleton className="h-5 w-full max-w-2xl" />
			</div>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
				<div className="min-w-0 space-y-6">
					<Skeleton className="h-[420px] rounded-lg" />
					<div className="grid gap-6 lg:grid-cols-2">
						<DataListCardSkeleton rows={5} />
						<DataListCardSkeleton rows={5} />
					</div>
					<DataListCardSkeleton rows={3} />
				</div>
				<div className="space-y-4">
					<Card className="space-y-5 p-5">
						<div className="grid grid-cols-2 gap-3">
							<Skeleton className="h-20" />
							<Skeleton className="h-20" />
						</div>
						<Skeleton className="h-12" />
					</Card>
					<Card className="space-y-4 p-5">
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-10" />
						<Skeleton className="h-10" />
						<Skeleton className="h-10" />
					</Card>
				</div>
			</div>
		</LoadingRegion>
	);
}

export function PortfolioPageSkeleton() {
	return (
		<LoadingRegion>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{skeletonKeys(4).map((key) => (
					<MetricSkeleton key={key} />
				))}
			</div>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
				<DataListCardSkeleton rows={4} />
				<DataListCardSkeleton rows={4} />
			</div>
			<DataListCardSkeleton rows={6} />
		</LoadingRegion>
	);
}

export function WalletPageSkeleton() {
	return (
		<LoadingRegion>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{skeletonKeys(4).map((key) => (
					<MetricSkeleton key={key} />
				))}
			</div>
			<div className="grid gap-6 xl:grid-cols-[320px_1fr_1fr]">
				{skeletonKeys(3).map((key) => (
					<Card key={key} className="space-y-4 p-5">
						<Skeleton className="h-6 w-40" />
						<Skeleton className="h-10" />
						<Skeleton className="h-10" />
						<Skeleton className="h-10" />
						<Skeleton className="h-10" />
					</Card>
				))}
			</div>
			<div className="grid gap-6 xl:grid-cols-2">
				<DataListCardSkeleton rows={3} />
				<DataListCardSkeleton rows={3} />
			</div>
		</LoadingRegion>
	);
}

export function SecurityPageSkeleton() {
	return (
		<LoadingRegion>
			<div className="grid gap-6 xl:grid-cols-[380px_1fr_1fr]">
				<Card className="space-y-4 p-5">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-10" />
					<Skeleton className="h-10" />
					<Skeleton className="h-10" />
				</Card>
				<DataListCardSkeleton rows={4} />
				<DataListCardSkeleton rows={4} />
			</div>
		</LoadingRegion>
	);
}

export function HistoryPageSkeleton() {
	return (
		<LoadingRegion>
			<DataListCardSkeleton rows={7} />
		</LoadingRegion>
	);
}

export function ExportsPageSkeleton() {
	return (
		<LoadingRegion>
			<Card className="space-y-5 p-5">
				<div className="flex items-center justify-between gap-4">
					<div className="space-y-2">
						<Skeleton className="h-8 w-40" />
						<Skeleton className="h-4 w-64" />
					</div>
					<Skeleton className="h-10 w-36" />
				</div>
				<div className="space-y-3">
					{skeletonKeys(4).map((key) => (
						<div key={key} className="space-y-2 rounded-lg border p-4">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-3 w-40" />
						</div>
					))}
				</div>
			</Card>
		</LoadingRegion>
	);
}

export function GenericRouteSkeleton() {
	return (
		<LoadingRegion>
			<Card className="space-y-5 p-6">
				<Skeleton className="h-8 w-1/2" />
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-36" />
			</Card>
		</LoadingRegion>
	);
}
