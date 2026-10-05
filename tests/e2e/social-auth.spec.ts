import { expect, test } from "@playwright/test";

test("social auth cancellation returns the user to login", async ({ page }) => {
	await page.goto("/auth/callback?error=oauth_cancelled");

	await expect(page).toHaveURL(/\/login$/);
	await expect(page.getByText("Autenticação cancelada.")).toBeVisible();
});

test("an incomplete social auth callback returns the user to login", async ({
	page,
}) => {
	await page.goto("/auth/callback?provider=google");

	await expect(page).toHaveURL(/\/login$/);
	await expect(
		page.getByText("Retorno de login inválido. Inicie o login novamente."),
	).toBeVisible();
});
