// Filtering and sorting for the deal finder.
// One job: given the full deal list and the current controls, return the
// deals to show, in the order the shopper asked for.

import { discountPct, saveAmount } from "./deals.js";

export const SORTS = {
  "biggest-discount": "Biggest % off",
  "biggest-saving": "Biggest $ saving",
  "lowest-price": "Lowest price",
  "best-verdict": "Best verdict first",
};

const VERDICT_RANK = { "new-low": 0, strong: 1, routine: 2 };

export function filterDeals(deals, state) {
  const q = state.query.trim().toLowerCase();
  let out = deals.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (state.minDiscount > 0 && discountPct(d) < state.minDiscount) return false;
    if (state.verdict !== "all" && d.verdict !== state.verdict) return false;
    if (q) {
      const hay = (d.product + " " + d.store + " " + d.category).toLowerCase();
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  switch (state.sort) {
    case "biggest-saving":
      out = out.slice().sort((a, b) => saveAmount(b) - saveAmount(a));
      break;
    case "lowest-price":
      out = out.slice().sort((a, b) => a.sale - b.sale);
      break;
    case "best-verdict":
      out = out
        .slice()
        .sort((a, b) => VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] || discountPct(b) - discountPct(a));
      break;
    case "biggest-discount":
    default:
      out = out.slice().sort((a, b) => discountPct(b) - discountPct(a) || saveAmount(b) - saveAmount(a));
      break;
  }
  return out;
}

export function totals(deals) {
  const saving = deals.reduce((s, d) => s + saveAmount(d), 0);
  const newLows = deals.filter((d) => d.verdict === "new-low").length;
  return { count: deals.length, saving, newLows };
}
