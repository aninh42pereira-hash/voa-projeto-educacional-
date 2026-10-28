const opportunities = [
  {
    id: "informatica",
    category: "cursos",
    type: "Cursos",
    title: "Curso gratuito de informática",
    institution: "Escola Virtual — Fundação Bradesco",
    location: "Online",
    deadline: "Inscrições contínuas",
    description: "Aprenda os fundamentos da informática com aulas online e gratuitas. Uma boa oportunidade para construir sua base digital e fortalecer o currículo.",
    tags: ["curso", "gratuito", "informática", "tecnologia", "computador"],
    url: "https://www.ev.org.br/"
  },
  {
    id: "permanencia",
    category: "bolsas",
    type: "Bolsas",
    title: "Bolsa de permanência estudantil",
    institution: "Universidades e Institutos Federais",
    location: "Presencial · consultar instituição",
    deadline: "Consulte o edital local",
    description: "Programas de assistência estudantil podem oferecer apoio para alimentação, transporte, moradia e materiais. Consulte a instituição onde você estuda e verifique os critérios e prazos do edital.",
    tags: ["bolsa", "auxílio", "permanência", "estudo", "estudos", "gratuito"],
    url: "https://www.gov.br/mec/"
  },
  {
    id: "aprendiz",
    category: "trabalho",
    type: "Trabalho",
    title: "Programa Jovem Aprendiz",
    institution: "CIEE",
    location: "Vagas em todo o Brasil",
    deadline: "Vagas abertas ao longo do ano",
    description: "O programa combina experiência profissional e formação para jovens. Consulte oportunidades disponíveis, requisitos de idade e escolaridade na plataforma do CIEE.",
    tags: ["jovem aprendiz", "emprego", "trabalho", "primeiro emprego", "jovem"],
    url: "https://portal.ciee.org.br/"
  },
  {
    id: "programacao",
    category: "cursos",
    type: "Cursos",
    title: "Primeiros passos em programação",
    institution: "Escola Virtual — Fundação Bradesco",
    location: "Online",
    deadline: "Consulte os cursos disponíveis",
    description: "Explore conteúdos de lógica e programação para começar a desenvolver habilidades digitais. Confira a disponibilidade, o formato e a emissão de certificado na plataforma.",
    tags: ["curso", "programação", "logica", "gratuito", "tecnologia", "certificado"],
    url: "https://www.ev.org.br/"
  },
  {
    id: "marketing",
    category: "cursos",
    type: "Cursos",
    title: "Curso de Marketing Digital",
    institution: "Sebrae",
    location: "Online",
    deadline: "Inscrições contínuas",
    description: "Conheça conceitos e ferramentas de marketing digital para pequenos negócios. Confira os cursos e materiais gratuitos disponíveis na plataforma.",
    tags: ["curso", "marketing", "digital", "gratuito", "comunicação"],
    url: "https://sebrae.com.br/sites/PortalSebrae/cursosonline"
  },
  {
    id: "estagio",
    category: "trabalho",
    type: "Trabalho",
    title: "Estágio em Administração",
    institution: "Nube",
    location: "Consulte vagas na sua região",
    deadline: "Oportunidades atualizadas",
    description: "Encontre oportunidades de estágio e aprenda na prática. Consulte os requisitos de cada vaga e mantenha seus dados e currículo atualizados.",
    tags: ["estágio", "administracao", "trabalho", "emprego", "currículo"],
    url: "https://www.nube.com.br/"
  },
  {
    id: "enem",
    category: "enem",
    type: "ENEM",
    title: "Guia de preparação para o ENEM",
    institution: "Inep",
    location: "Online",
    deadline: "Consulte o calendário oficial",
    description: "Acesse informações oficiais sobre o exame, provas anteriores, matriz de referência e orientações para se preparar com confiança.",
    tags: ["enem", "vestibular", "prova", "estudo", "redação"],
    url: "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem"
  },
  {
    id: "ifs",
    category: "ifs",
    type: "IFs",
    title: "Cursos técnicos nos Institutos Federais",
    institution: "Rede Federal de Educação Profissional",
    location: "Presencial · diversas cidades",
    deadline: "Editais conforme cada campus",
    description: "Os Institutos Federais oferecem cursos técnicos e de graduação em diferentes áreas. Consulte o site do IF da sua região para conhecer cursos e processos seletivos.",
    tags: ["instituto federal", "IF", "curso técnico", "universidade", "vestibular"],
    url: "https://www.gov.br/mec/pt-br/assuntos/ept/rede-federal"
  },
  {
    id: "ingles",
    category: "cursos",
    type: "Cursos",
    title: "Inglês para sua próxima oportunidade",
    institution: "Kultivi",
    location: "Online",
    deadline: "Inscrições contínuas",
    description: "Estude inglês online e no seu ritmo. Conheça os conteúdos disponíveis e verifique como funciona o acesso gratuito à plataforma.",
    tags: ["inglês", "idioma", "curso", "gratuito", "online"],
    url: "https://kultivi.com/"
  }
];

const favoriteKey = "voamais:favorites";
const listElement = document.querySelector("#opportunity-list");
const filterElement = document.querySelector("#opportunity-filter");
const detailDialog = document.querySelector("#opportunity-dialog");
const detailContent = document.querySelector("#opportunity-dialog-content");
const toast = document.querySelector("#toast");
let toastTimer;

function readFavorites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(favoriteKey) || "[]");
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []);
  } catch (error) {
    console.error("Não foi possível carregar os favoritos salvos.", error);
    return new Set();
  }
}

let favorites = readFavorites();
let activeSearch = "";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function normalize(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

export function getOpportunities() {
  return opportunities;
}

export function searchOpportunities(query) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return opportunities.filter((item) => {
    const content = normalize([item.title, item.type, item.institution, item.location, item.description, ...item.tags].join(" "));
    return terms.every((term) => content.includes(term));
  });
}

export function setOpportunitySearch(query) {
  activeSearch = query.trim();
}

export function renderOpportunities(category = "todas") {
  let items = category === "todas" ? opportunities : opportunities.filter((item) => item.category === category);
  if (activeSearch) {
    const matchingIds = new Set(searchOpportunities(activeSearch).map((item) => item.id));
    items = items.filter((item) => matchingIds.has(item.id));
  }
  if (!items.length) {
    listElement.innerHTML = `<p class="no-opportunities">${activeSearch ? "Nenhuma oportunidade encontrada para essa busca." : "Nenhuma oportunidade encontrada nesta categoria."}</p>`;
    return;
  }
  listElement.innerHTML = items.map((item) => `
    <article class="opportunity-row">
      <span class="opportunity-type type-${escapeHtml(item.category)}">${escapeHtml(item.type)}</span>
      <h3 class="opportunity-title">${escapeHtml(item.title)}</h3>
      <span class="opportunity-institution">${escapeHtml(item.institution)}</span>
      <span class="opportunity-location">${escapeHtml(item.location)}</span>
      <span class="opportunity-deadline"><strong>Prazo</strong>${escapeHtml(item.deadline)}</span>
      <div class="opportunity-actions"><button class="opportunity-open" type="button" data-opportunity="${escapeHtml(item.id)}">Acessar →</button></div>
      <button class="favorite-button${favorites.has(item.id) ? " is-favorite" : ""}" type="button" data-favorite="${escapeHtml(item.id)}" aria-label="${favorites.has(item.id) ? "Remover dos" : "Adicionar aos"} favoritos" aria-pressed="${favorites.has(item.id)}"><svg class="icon"><use href="#i-heart"/></svg></button>
    </article>`).join("");
}

export function showOpportunityDetails(id) {
  const item = opportunities.find((opportunity) => opportunity.id === id);
  if (!item) return;
  detailContent.innerHTML = `
    <p class="eyebrow">${escapeHtml(item.type)} · Oportunidade</p>
    <h2 id="opportunity-dialog-title">${escapeHtml(item.title)}</h2>
    <div class="detail-meta"><span>${escapeHtml(item.institution)}</span><span>${escapeHtml(item.location)}</span><span>${escapeHtml(item.deadline)}</span></div>
    <p class="detail-description">${escapeHtml(item.description)}</p>
    <a class="button button-primary detail-action" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">Acessar oportunidade <svg class="icon"><use href="#i-arrow"/></svg></a>`;
  detailDialog.showModal();
}

listElement.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.opportunity) {
    showOpportunityDetails(button.dataset.opportunity);
    return;
  }
  if (button.dataset.favorite) {
    const id = button.dataset.favorite;
    const wasFavorite = favorites.has(id);
    if (wasFavorite) favorites.delete(id);
    else favorites.add(id);
    try {
      localStorage.setItem(favoriteKey, JSON.stringify([...favorites]));
    } catch (error) {
      console.error("Não foi possível salvar os favoritos.", error);
      if (wasFavorite) favorites.add(id);
      else favorites.delete(id);
      renderOpportunities(filterElement.value);
      showToast("Não foi possível salvar seu favorito neste dispositivo.");
      return;
    }
    renderOpportunities(filterElement.value);
    if (favorites.has(id)) showToast("Oportunidade adicionada aos favoritos.");
    else showToast("Oportunidade removida dos favoritos.");
  }
});

filterElement.addEventListener("change", () => renderOpportunities(filterElement.value));
renderOpportunities();
