// Rendering for the deal finder: deal cards, the result count and the
// detail panel. No data lives here — it all comes from deals.js.

import { discountPct, money, saveAmount } from "./deals.js";

const VERDICT_LABEL = {
  "new-low": "New low",
  strong: "Strong price",
  routine: "Routine sale",
};

export function verdictLabel(v) {
  return VERDICT_LABEL[v] || v;
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function dealCard(d) {
  const pct = discountPct(d);
  return (
    '<article class="card" data-id="' +
    esc(d.id) +
    '" tabindex="0" role="button" aria-label="' +
    esc(d.product) +
    ' deal details">' +
    '<div class="card-top"><span class="store">' +
    esc(d.store) +
    "</span>" +
    '<span class="cat">' +
    esc(d.category) +
    "</span></div>" +
    '<h3 class="card-name">' +
    esc(d.product) +
    "</h3>" +
    '<div class="price-row"><span class="sale">' +
    money(d.sale) +
    '</span><span class="usual"><s>' +
    money(d.usual) +
    "</s></span>" +
    '<span class="pct">−' +
    pct +
    "%</span></div>" +
    '<p class="save">You save ' +
    money(saveAmount(d)) +
    "</p>" +
    '<p class="verdict verdict-' +
    d.verdict +
    '">' +
    verdictLabel(d.verdict) +
    "</p>" +
    '<p class="checked">Checked ' +
    esc(d.checked) +
    " · " +
    esc(d.source) +
    "</p>" +
    '<a class="go" href="' +
    esc(d.url) +
    '" target="_blank" rel="noopener">View at ' +
    esc(d.store) +
    " →</a>" +
    "</article>"
  );
}

export function renderGrid(list, gridEl, countEl) {
  gridEl.innerHTML = list.length
    ? list.map(dealCard).join("")
    : '<p class="empty">No deals match those filters. Try clearing the search or lowering the discount.</p>';
  countEl.textContent =
    list.length + (list.length === 1 ? " deal" : " deals") + " found";
}

export function detailHtml(d) {
  const pct = discountPct(d);
  return (
    '<div class="detail-head"><span class="store">' +
    esc(d.store) +
    "</span>" +
    '<span class="cat">' +
    esc(d.category) +
    "</span>" +
    '<span class="verdict verdict-' +
    d.verdict +
    '">' +
    verdictLabel(d.verdict) +
    "</span></div>" +
    "<h2>" +
    esc(d.product) +
    "</h2>" +
    '<div class="price-row big"><span class="sale">' +
    money(d.sale) +
    '</span><span class="usual"><s>' +
    money(d.usual) +
    "</s></span>" +
    '<span class="pct">−' +
    pct +
    "%</span></div>" +
    "<p class=\"save\">You save " +
    money(saveAmount(d)) +
    " (" +
    pct +
    "% off the usual price).</p>" +
    "<h3>Is it really a deal?</h3><p>" +
    esc(d.verdictNote) +
    "</p>" +
    "<h3>What to know</h3><p>" +
    esc(d.note) +
    "</p>" +
    (d.alsoAt ? "<h3>Also at</h3><p>" + esc(d.alsoAt) + "</p>" : "") +
    "<h3>Price check</h3><p>Checked " +
    esc(d.checked) +
    " — " +
    esc(d.source) +
    ". Prices can change during Black Friday week; the store page is the final word.</p>" +
    '<a class="go big" href="' +
    esc(d.url) +
    '" target="_blank" rel="noopener">View at ' +
    esc(d.store) +
    " →</a>"
  );
}
