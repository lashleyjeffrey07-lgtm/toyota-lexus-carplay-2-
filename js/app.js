function money(n){
  return `$${Number(n).toFixed(0)}`;
}
function byId(id){ return document.getElementById(id); }

function productCardHTML(p){
  return `
    <div class="card">
      <div class="card-top">
        ${p.sale ? `<div class="badge-sale">Sale!</div>` : ``}
        <img src="${p.image}" alt="${p.title}">
      </div>
      <div class="card-body">
        <h3 class="card-title">${p.title}</h3>
        <p class="card-meta">${p.short}</p>
        <p class="card-meta"><strong>Fitment:</strong> ${p.fitment}</p>

        <div class="price">
          ${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ``}
          <strong>${money(p.price)}</strong>
        </div>

        <div class="card-actions">
          <a class="btn primary" href="contact.html?product=${encodeURIComponent(p.id)}">Order / Quote</a>
          <button class="btn" type="button" data-open="${p.id}">Details</button>
        </div>

        <p class="muted small" style="margin:10px 0 0">
          Confirm screen type + year before purchase.
        </p>
      </div>
    </div>
  `;
}

function renderInto(containerId, list){
  const wrap = byId(containerId);
  if(!wrap) return;

  if(!list.length){
    wrap.innerHTML = `<div class="notice">No matches in this section.</div>`;
    return;
  }

  wrap.innerHTML = list.map(productCardHTML).join("");

  wrap.querySelectorAll("button[data-open]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-open");
      const p = window.PRODUCTS.find(x => x.id === id);
      if(!p) return;

      const lines = [
        p.title,
        "",
        `Fitment: ${p.fitment}`,
        `Price: ${money(p.price)}`,
        "",
        "What's included:",
        ...(p.whatYouGet || []).map(x => `- ${x}`),
        "",
        "To order: hit 'Order / Quote' and send your year + model + whether you have factory navigation."
      ];
      alert(lines.join("\n"));
    });
  });
}

function applyFilters(){
  const q = (byId("q")?.value || "").toLowerCase().trim();
  const makeFilter = byId("make")?.value || "All";

  let list = [...window.PRODUCTS];

  if(makeFilter !== "All"){
    list = list.filter(p => p.make === makeFilter);
  }

  if(q){
    list = list.filter(p => {
      const hay = `${p.title} ${p.short} ${p.make} ${p.model} ${p.years} ${p.fitment} ${(p.tags||[]).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }

  const lexus = list.filter(p => p.make === "Lexus");
  const toyota = list.filter(p => p.make === "Toyota");

  renderInto("products-lexus", lexus);
  renderInto("products-toyota", toyota);
}

function initShop(){
  if(!byId("products-lexus") || !byId("products-toyota")) return;

  const makes = Array.from(new Set(window.PRODUCTS.map(p => p.make))).sort();
  const makeSel = byId("make");
  if(makeSel){
    makeSel.innerHTML =
      `<option value="All">All makes</option>` +
      makes.map(m => `<option value="${m}">${m}</option>`).join("");
  }

  applyFilters();
  byId("q")?.addEventListener("input", applyFilters);
  byId("make")?.addEventListener("change", applyFilters);
}

function initContact(){
  const params = new URLSearchParams(location.search);
  const product = params.get("product");
  const prodInput = byId("product");
  if(product && prodInput) prodInput.value = product;
}

document.addEventListener("DOMContentLoaded", () => {
  initShop();
  initContact();
});
