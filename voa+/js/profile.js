import { getOpportunities } from "./opportunities.js";

const dialog = document.querySelector("#profile-dialog");
const form = document.querySelector("#profile-form");
const resultArea = document.querySelector("#profile-results");
const goalCategories = {
  estudar: ["cursos", "bolsas", "ifs"],
  trabalhar: ["trabalho"],
  aprender: ["cursos"],
  enem: ["enem", "ifs"]
};
const interestTags = {
  tecnologia: ["tecnologia", "programação", "informática"],
  administracao: ["administração", "estágio"],
  comunicacao: ["marketing", "comunicação"],
  educacao: ["enem", "estudo", "curso"],
  saude: ["curso", "bolsa"],
  geral: []
};

document.querySelectorAll(".profile-trigger").forEach((button) => {
  button.addEventListener("click", () => dialog.showModal());
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const answers = new FormData(form);
  const preferredCategories = goalCategories[answers.get("goal")] || [];
  const preferredTags = interestTags[answers.get("interest")] || [];
  const preferFree = answers.has("free");
  const ranked = getOpportunities().map((item) => {
    let score = preferredCategories.includes(item.category) ? 3 : 0;
    const searchable = [item.title, item.description, ...item.tags].join(" ").toLocaleLowerCase("pt-BR");
    score += preferredTags.filter((tag) => searchable.includes(tag)).length;
    if (preferFree && item.tags.includes("gratuito")) score += 2;
    if (answers.get("modality") === "online" && item.location.toLocaleLowerCase("pt-BR").includes("online")) score += 1;
    if (answers.get("modality") === "presencial" && item.location.toLocaleLowerCase("pt-BR").includes("presencial")) score += 1;
    return { item, score };
  }).sort((a, b) => b.score - a.score);
  const suggestions = ranked.slice(0, 3).map(({ item }) => item.title);
  resultArea.innerHTML = `<h3>Ideias para o seu caminho</h3><ul>${suggestions.map((title) => `<li>${title}</li>`).join("")}</ul><p class="detail-description">Confira os requisitos e prazos de cada oportunidade antes de se inscrever.</p>`;
  resultArea.hidden = false;
  resultArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
