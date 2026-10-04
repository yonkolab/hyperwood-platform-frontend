import { ListFilter, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Select } from "#/components/ui/select";
import type { HomeSearch } from "#/routes/index";

export type MarketFiltersProps = {
	categories: string[];
	search: HomeSearch;
	onChange: (next: Partial<HomeSearch>) => void;
};

const SORT_OPTIONS: {
	value: NonNullable<HomeSearch["sort"]>;
	label: string;
}[] = [
	{ value: "highest_volume", label: "Volume 24h" },
	{ value: "highest_volume_total", label: "Volume total" },
	{ value: "liquidity", label: "Liquidez" },
	{ value: "newest", label: "Mais novos" },
	{ value: "ending_soon", label: "Terminando em breve" },
	{ value: "competitive", label: "Competitivo" },
];

const PERIOD_OPTIONS: {
	value: NonNullable<HomeSearch["period"]>;
	label: string;
}[] = [
	{ value: "daily", label: "Diário" },
	{ value: "weekly", label: "Semanal" },
	{ value: "monthly", label: "Mensal" },
	{ value: "all", label: "Todos" },
];

const STATUS_OPTIONS: {
	value: NonNullable<HomeSearch["status"]>;
	label: string;
}[] = [
	{ value: "active", label: "Ativos" },
	{ value: "settled", label: "Encerrados" },
];

export function MarketFilters(props: MarketFiltersProps) {
	const [searchOpen, setSearchOpen] = useState(Boolean(props.search.search));
	const [filtersOpen, setFiltersOpen] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const pillsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (searchOpen) {
			searchInputRef.current?.focus();
		}
	}, [searchOpen]);

	const toggleHiddenFlag = (
		key: "hideSports" | "hideCrypto" | "hideEarnings",
	) => {
		props.onChange({ [key]: !props.search[key] });
	};

	return (
		<div id="market-filters" className="scroll-mt-24 space-y-3">
			<div className="flex flex-wrap items-center gap-2">
				<h2 className="font-display hidden text-2xl font-semibold text-foreground md:block">
					Todos os mercados
				</h2>
				<div className="ml-auto hidden items-center gap-1.5 md:flex">
					{searchOpen ? (
						<form
							className="flex items-center gap-1.5"
							onSubmit={(event) => {
								event.preventDefault();
								const value = searchInputRef.current?.value.trim() ?? "";
								props.onChange({ search: value || undefined });
							}}
						>
							<Input
								ref={searchInputRef}
								defaultValue={props.search.search ?? ""}
								placeholder="Pesquisar mercado..."
								className="h-9 w-52 text-sm"
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label="Fechar busca"
								onClick={() => {
									setSearchOpen(false);
									props.onChange({ search: undefined });
								}}
							>
								<X className="size-4" />
							</Button>
						</form>
					) : (
						<Button
							variant="ghost"
							size="icon"
							id="market-search-toggle"
							aria-label="Pesquisar"
							onClick={() => {
								setSearchOpen(true);
							}}
						>
							<Search className="size-5" />
						</Button>
					)}
					<Button
						variant="ghost"
						size="icon"
						id="market-filter-toggle"
						aria-label="Filtros"
						aria-expanded={filtersOpen}
						className={filtersOpen ? "bg-subtle text-foreground" : undefined}
						onClick={() => {
							setFiltersOpen((value) => !value);
						}}
					>
						<ListFilter className="size-5" />
					</Button>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<div
					ref={pillsRef}
					className="scrollbar-none min-w-0 flex-1 overflow-x-auto"
				>
					<div className="flex min-w-max items-center gap-2">
						<button
							type="button"
							className={pillClass(!props.search.category)}
							onClick={() => {
								props.onChange({ category: undefined });
							}}
						>
							Todos
						</button>
						{props.categories.map((category) => (
							<button
								key={category}
								type="button"
								className={pillClass(props.search.category === category)}
								onClick={() => {
									props.onChange({
										category:
											props.search.category === category ? undefined : category,
									});
								}}
							>
								{category}
							</button>
						))}
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Ver mais categorias"
					onClick={() => {
						pillsRef.current?.scrollBy({ left: 280, behavior: "smooth" });
					}}
				>
					<span className="text-base font-semibold">›</span>
				</Button>
			</div>

			{filtersOpen ? (
				<div className="flex flex-wrap items-end gap-4 rounded-lg border border-edge bg-card p-4">
					<label className="space-y-1.5 text-xs font-medium text-muted">
						<span>Ordenar por</span>
						<span className="relative block">
							<span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-muted">
								<ListFilter className="size-3.5" />
							</span>
							<Select
								className="h-9 w-44 pl-7 text-sm"
								value={props.search.sort ?? "newest"}
								onChange={(event) => {
									props.onChange({
										sort: event.target.value as HomeSearch["sort"],
									});
								}}
							>
								{SORT_OPTIONS.map((option) => (
									<option key={option.label} value={option.value}>
										{option.label}
									</option>
								))}
							</Select>
						</span>
					</label>
					<label className="space-y-1.5 text-xs font-medium text-muted">
						<span>Período</span>
						<Select
							className="h-9 w-32 text-sm"
							value={props.search.period ?? "all"}
							onChange={(event) => {
								props.onChange({
									period: event.target.value as HomeSearch["period"],
								});
							}}
						>
							{PERIOD_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
					</label>
					<label className="space-y-1.5 text-xs font-medium text-muted">
						<span>Status</span>
						<Select
							className="h-9 w-32 text-sm"
							value={props.search.status ?? "active"}
							onChange={(event) => {
								props.onChange({
									status: event.target.value as HomeSearch["status"],
								});
							}}
						>
							{STATUS_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
					</label>
					<div className="flex items-center gap-4 pb-1">
						{(
							[
								["hideSports", "Hide sports"],
								["hideCrypto", "Hide crypto"],
								["hideEarnings", "Hide earnings"],
							] as const
						).map(([key, label]) => (
							<label
								key={key}
								className="flex items-center gap-2 text-sm text-foreground"
							>
								<input
									type="checkbox"
									checked={Boolean(props.search[key])}
									onChange={() => {
										toggleHiddenFlag(key);
									}}
									className="size-4 rounded border-edge accent-[#0d382e]"
								/>
								{label}
							</label>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
}

function pillClass(active: boolean) {
	return `h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition ${
		active
			? "border-transparent bg-foreground text-background"
			: "border-edge bg-card text-muted hover:border-slate-300 hover:text-foreground"
	}`;
}
