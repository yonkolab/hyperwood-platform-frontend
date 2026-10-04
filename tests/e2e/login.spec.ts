import { expect, test } from "@playwright/test";

test("login page does not load Node crypto in the browser", async ({ page }) => {
	const cryptoErrors: string[] = [];
	page.on("console", (message) => {
		if (
			(message.type() === "error" || message.type() === "warning") &&
			/node:crypto|randomUUID/.test(message.text())
		) {
			cryptoErrors.push(message.text());
		}
	});
	page.on("pageerror", (error) => {
		if (/node:crypto|randomUUID/.test(error.message)) {
			cryptoErrors.push(error.message);
		}
	});

	await page.goto("/login");
	await page.waitForTimeout(1500);
	expect(cryptoErrors).toEqual([]);
	await expect(page.getByRole("heading", { name: "Entre na sua conta" })).toBeVisible();
});
