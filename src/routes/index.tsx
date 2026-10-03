import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { HeroMarket } from "#/components/markets/hero-market";
import { HomeSidebar } from "#/components/markets/home-sidebar";
import { MarketCard } from "#/components/markets/market-card";
import { SectionHeading } from "#/components/ui/section-heading";
import { homePageQueryOptions } from "#/lib/query-options";

type HomeSearch = {
	category?: string;
	search?: string;
	tag?: string;
};

export const Route = createFileRoute("/")({
	validateSearch: (search): HomeSearch => ({
		category: typeof search.category === "string" ? search.category : undefined,
		search: typeof search.search === "string" ? search.search : undefined,
		tag: typeof search.tag === "string" ? search.tag : undefined,
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, deps }) => {
		await context.queryClient.ensureQueryData(homePageQueryOptions(deps));
	},
	component: HomePage,
});

function HomePage() {
	const search = Route.useSearch();
	const { data } = useSuspenseQuery(homePageQueryOptions(search));

	return (
		<div className="space-y-10">
			<section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
				<HeroMarket data={data} />
				<HomeSidebar data={data} />
			</section>
			<section className="space-y-5">
				<SectionHeading>
					<div>
						<h2 className="text-2xl font-semibold text-foreground">
							Todos os mercados
						</h2>
						<p className="mt-1 text-sm text-muted">
							Dados públicos alimentados pelo catálogo do Hyperwood.
						</p>
					</div>
				</SectionHeading>
				<div className="grid gap-4 lg:grid-cols-3">
					{data.marketList.markets.map((market) => (
						<MarketCard key={market.id} market={market} />
					))}
				</div>
			</section>
		</div>
	);
}
