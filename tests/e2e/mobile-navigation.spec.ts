import { expect, test } from "@playwright/test";

test("mobile navigation hides the hero carousel and opens the More sheet", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/");
	await page.waitForFunction(() =>
		[...document.querySelectorAll("button")].some((button) =>
			Object.keys(button).some((key) => key.startsWith("__reactProps$")),
		),
	);

	const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
	const documentWidth = await page.evaluate(
		() => document.documentElement.scrollWidth,
	);
	expect(documentWidth).toBeLessThanOrEqual(viewportWidth);
	await expect(page.getByRole("navigation", { name: "Categorias" })).toBeVisible();
	await expect(
		page.getByRole("textbox", { name: "Pesquisar mercados" }),
	).toBeVisible();
	await expect(page.getByRole("button", { name: "Fechar aviso" })).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "2026 Midterms Predictions" }),
	).toBeVisible();
	const featuredCard = await page
		.getByRole("complementary", { name: "2026 Midterms Predictions" })
		.boundingBox();
	expect(featuredCard?.y).toBeLessThan(260);
	await expect(page.locator(".hero-slide-in")).toBeHidden();

	const bottomNav = page.getByRole("navigation", {
		name: "Navegação principal",
	});
	await expect(bottomNav).toBeVisible();
	await bottomNav.getByRole("button", { name: "Mais" }).click();
	await expect(page.getByRole("heading", { name: "Mais opções" })).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Categorias" }),
	).toBeVisible();

	await page.getByRole("button", { name: "Fechar menu" }).click();
	await bottomNav.getByText("Buscar", { exact: true }).click();
	const search = page.getByRole("textbox", { name: "Pesquisar mercados" });
	await expect(search).toBeFocused();
	await search.fill("midterms");
	await search.press("Enter");
	await expect(page).toHaveURL(/search=midterms/);

	await bottomNav.getByText("Em alta", { exact: true }).click();
	await expect(page).toHaveURL(/sort=highest_volume/);
});
