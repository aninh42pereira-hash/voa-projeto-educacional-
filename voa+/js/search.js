import { searchOpportunities, setOpportunitySearch, showOpportunityDetails } from "./opportunities.js";

const form = document.querySelector("#search-form");
const input = document.querySelector("#site-search");
const results = document.querySelector("#search-results");
const opportunitySelect = document.querySelector("#opportunity-filter");
const categories = {
  cursos: "cursos", curso: "cursos", bolsas: "bolsas", bolsa: "bolsas",
  enem: "enem", vestibulares: "enem", ifs: "ifs", trabalho: "trabalho",
  emprego: "trabalho"
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function normalize(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function showResults(query) {
  const trimmed = query.trim();
  if (!trimmed) {
    results.hidden = true;
    results.innerHTML = "";
    return;
  }
  const matches = searchOpportunities(trimmed);
  results.innerHTML = matches.length
    ? matches.slice(0, 5).map((item) => `<button class="search-result" type="button" role="option" aria-label="${escapeHtml(item.title)}" data-result="${escapeHtml(item.id)}"><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.type)} · ${escapeHtml(item.institution)}</small></span><span aria-hidden="true">→</span></button>`).join("")
    : `<p class="search-empty">Ainda não encontramos essa oportunidade. Tente outro termo ou explore as categorias.</p>`;
  results.hidden = false;
}

input.addEventListener("input", () => showResults(input.value));
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = normalize(input.value.trim());
  const category = categories[query];
  opportunitySelect.value = category || "todas";
  setOpportunitySearch(category ? "" : input.value.trim());
  opportunitySelect.dispatchEvent(new Event("change"));
  if (category || searchOpportunities(query).length) document.querySelector("#oportunidades").scrollIntoView({ behavior: "smooth" });
  else showResults(input.value);
});

results.addEventListener("click", (event) => {
  const button = event.target.closest("[data-result]");
  if (!button) return;
  showOpportunityDetails(button.dataset.result);
  results.hidden = true;
});

document.addEventListener("click", (event) => {
  if (!form.contains(event.target)) results.hidden = true;
});

document.querySelectorAll("[data-search]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.search;
    showResults(input.value);
    input.focus();
    input.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

document.querySelectorAll("[data-category-link]").forEach((link) => {
  link.addEventListener("click", () => {
    const category = link.dataset.categoryLink;
    if (categories[category]) {
      setOpportunitySearch("");
      opportunitySelect.value = categories[category];
      opportunitySelect.dispatchEvent(new Event("change"));
    }
  });
});
