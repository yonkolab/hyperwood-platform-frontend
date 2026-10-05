# Prediction-market policy reference notes

**Research snapshot:** 2026-10-05. First-party Polymarket and Kalshi sources only. These are source notes for product research, not legal advice or proposed Hyperwood terms.

## Verified operating-model details

- **Polymarket contracts and trading:** Events group one or more binary Yes/No markets; winning outcome tokens can be redeemed for $1. The trading guide says only takers pay fees in fee-enabled markets, with category-dependent rates; it also identifies fee-free geopolitical/world-event markets. Check the individual market's fee parameters rather than treating the published table as universal. Sources: <https://docs.polymarket.com/concepts/markets-events.md> and <https://docs.polymarket.com/trading/fees.md> (accessed 2026-10-05).
- **Polymarket settlement and disputes:** Market-specific rules identify the resolution source, end date, and edge cases. The resolution guide describes UMA proposal/challenge and escalation to UMA voting for disputed prediction-market resolutions, and a separate Chainlink TWAP method for up/down markets. This is an oracle/market-outcome dispute process, not a customer complaint or legal dispute procedure. Source: <https://docs.polymarket.com/concepts/resolution.md> (accessed 2026-10-05).
- **Polymarket risk/jurisdiction signal:** The Terms page's rendered footer identifies QCX LLC d/b/a Polymarket US as a CFTC-regulated designated contract market, while saying the international platform is separate and not CFTC-regulated; it also warns of substantial risk of loss. The full Terms body was not exposed in this capture, so this footer is not a complete jurisdiction or risk summary. Source: <https://polymarket.com/tos> (accessed 2026-10-05).
- **Kalshi contracts and settlement:** Kalshi's API documentation describes market states through trading, determination, possible dispute/amendment, and finalization. Its settlement guide says Yes or No holders receive $1 per contract, positions are netted, and settlement timing may vary; it says settlement fees are zero for simple Yes/No determinations, with possible fees for sub-cent scalar settlement. Sources: <https://docs.kalshi.com/getting_started/market_lifecycle.md> and <https://docs.kalshi.com/getting_started/market_settlement.md> (accessed 2026-10-05).
- **Kalshi fees:** Its API documentation describes a fee-rounding mechanism, including distinct balance precision for direct and non-direct members. This technical detail is not a complete customer fee schedule. Source: <https://docs.kalshi.com/getting_started/fee_rounding.md> (accessed 2026-10-05).

## Policy coverage not verified

The policy documents below could not be read in full during this capture: Polymarket <https://polymarket.com/tos> and <https://polymarket.com/privacy>, and Kalshi <https://kalshi.com/terms-of-use> and <https://kalshi.com/privacy-policy> (all accessed 2026-10-05). Accordingly, do **not** infer answers about age/eligibility or KYC; Brazil or other geographic availability and regulatory/jurisdictional limits; contract-specific trading terms, fees, or risk disclosures; customer-facing settlement appeals, complaints, arbitration, or governing law; or privacy data categories, purposes, sharing, retention, data-subject rights, security controls, and cookies. Each item remains an open source-review question, not a statement that the policy omits it.

- **Polymarket Terms:** <https://polymarket.com/tos> (accessed 2026-10-05). The route returned a policy title and site shell; rendered policy clauses were not available to inspect. Only the footer points above could be verified.
- **Polymarket Privacy:** <https://polymarket.com/privacy> (accessed 2026-10-05). The route returned a policy title and site shell; privacy-policy clauses were not available to inspect.
- **Kalshi Terms:** <https://kalshi.com/terms-of-use> (accessed 2026-10-05). The official site returned HTTP 429, preventing access to the policy text.
- **Kalshi Privacy:** <https://kalshi.com/privacy-policy> (accessed 2026-10-05). The official site returned HTTP 429, preventing access to the policy text.

## Research boundary

The accessible product documentation supports only the operating-model observations above; it does not replace the consumer Terms or Privacy policies. Revisit all four policy URLs before using policy-dependent assumptions for a Brazil/LGPD real-money product. This note makes no claim about Brazilian legal requirements or either operator's compliance.
