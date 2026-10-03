import { describe, expect, it } from "vitest";
import {
	formatCompactNumber,
	formatMoney,
	formatPriceBps,
	formatRelativeCountdown,
} from "./format";

describe("format helpers", () => {
	it("formats BRL money values for the trader UI", () => {
		expect(formatMoney(123456)).toMatch("1.234,56");
	});

	it("formats price basis points as percentages", () => {
		expect(formatPriceBps(5700)).toBe("57%");
	});

	it("formats compact numeric values", () => {
		expect(formatCompactNumber(15400)).toBeTruthy();
	});

	it("returns a countdown label for future timestamps", () => {
		const futureDate = new Date(Date.now() + 5 * 60 * 1000).toISOString();
		expect(formatRelativeCountdown(futureDate)).toMatch(/[mh:]/);
	});

	it("formats countdowns over 24h in days", () => {
		const sixDays = new Date(
			Date.now() + 6 * 24 * 60 * 60 * 1000,
		).toISOString();
		expect(formatRelativeCountdown(sixDays)).toMatch(/^6d/);

		const twoMonths = new Date(
			Date.now() + 62 * 24 * 60 * 60 * 1000,
		).toISOString();
		expect(formatRelativeCountdown(twoMonths)).toBe("62d");
	});
});
