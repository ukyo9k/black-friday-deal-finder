// Boot and wiring for the deal finder: reads the controls, re-renders on
// every change, opens the detail panel, and honours a #search= / #cat= /
// #store= / #min= hash so a link can open a pre-filtered view.

import { CATEGORIES, CHECKED_NOTE, DEALS, STORES, money } from "./deals.js";
import { SORTS, filterDeals, totals } from "./filters.js";
import { detailHtml, renderGrid } from "./render.js";

const $ = (id) => document.getElementById(id);

const state = {
  query: "",
  category: "All",
  store: "All",
  minDiscount: 0,
  verdict: "all",
  sort: "biggest-discount",
};

function readHash() {
  const h = new URLSearchParams(location.hash.slice(1));
  if (h.get("search")) state.query = h.get("search");
  if (h.get("cat") && CATEGORIES.includes(h.get("cat"))) state.category = h.get("cat");
  if (h.get("store") && STORES.includes(h.get("store"))) state.store = h.get("store");
  const min = parseInt(h.get("min") || "0", 10);
  if ([0, 25, 40, 50].includes(min)) state.minDiscount = min;
  if (h.get("sort") && SORTS[h.get("sort")]) state.sort = h.get("sort");
  return h.get("deal") || "";
}

function buildControls() {
  const catEl = $("category");
  CATEGORIES.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = c;
    b.dataset.cat = c;
    b.setAttribute("aria-pressed", c === state.category ? "true" : "false");
    b.addEventListener("click", () => {
      state.category = c;
      syncControls();
      apply();
    });
    catEl.appendChild(b);
  });

  const storeEl = $("store");
  STORES.forEach((s) => {
    const o = document.createElement("option");
    o.value = s;
    o.textContent = s === "All" ? "All stores" : s;
    storeEl.appendChild(o);
  });

  const sortEl = $("sort");
  Object.entries(SORTS).forEach(([v, label]) => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = label;
    sortEl.appendChild(o);
  });

  $("search").addEventListener("input", (e) => {
    state.query = e.target.value;
    apply();
  });
  storeEl.addEventListener("change", (e) => {
    state.store = e.target.value;
    apply();
  });
  sortEl.addEventListener("change", (e) => {
    state.sort = e.target.value;
    apply();
  });
  document.querySelectorAll('input[name="mindisc"]').forEach((r) =>
    r.addEventListener("change", (e) => {
      state.minDiscount = parseInt(e.target.value, 10);
      apply();
    }),
  );
  document.querySelectorAll('input[name="verdict"]').forEach((r) =>
    r.addEventListener("change", (e) => {
      state.verdict = e.target.value;
      apply();
    }),
  );
  $("clear").addEventListener("click", () => {
    state.query = "";
    state.category = "All";
    state.store = "All";
    state.minDiscount = 0;
    state.verdict = "all";
    state.sort = "biggest-discount";
    history.replaceState(null, "", location.pathname);
    syncControls();
    apply();
  });

  const grid = $("grid");
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card || e.target.closest("a")) return;
    openDetail(card.dataset.id);
  });
  grid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const card = e.target.closest(".card");
    if (card) openDetail(card.dataset.id);
  });
  $("detail-close").addEventListener("click", closeDetail);
  $("detail-backdrop").addEventListener("click", closeDetail);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });
}

function syncControls() {
  $("search").value = state.query;
  $("store").value = state.store;
  $("sort").value = state.sort;
  document.querySelectorAll("#category .chip").forEach((b) =>
    b.setAttribute("aria-pressed", b.dataset.cat === state.category ? "true" : "false"),
  );
  document.querySelectorAll('input[name="mindisc"]').forEach(
    (r) => (r.checked = parseInt(r.value, 10) === state.minDiscount),
  );
  document.querySelectorAll('input[name="verdict"]').forEach(
    (r) => (r.checked = r.value === state.verdict),
  );
}

function apply() {
  const list = filterDeals(DEALS, state);
  renderGrid(list, $("grid"), $("count"));
}

function openDetail(id) {
  const d = DEALS.find((x) => x.id === id);
  if (!d) return;
  $("detail-body").innerHTML = detailHtml(d);
  $("detail").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  $("detail").hidden = true;
  document.body.style.overflow = "";
}

function paintStats() {
  const t = totals(DEALS);
  $("stat-deals").textContent = t.count;
  $("stat-newlow").textContent = t.newLows;
  $("stat-save").textContent = money(t.saving);
  $("checked-note").textContent = CHECKED_NOTE;
}

const deepDeal = readHash();
buildControls();
syncControls();
paintStats();
apply();
if (deepDeal) openDetail(deepDeal);
