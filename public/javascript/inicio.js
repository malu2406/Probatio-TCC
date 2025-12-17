const nomesDisciplinas = {
  portugues: "Português",
  ingles: "Inglês",
  espanhol: "Espanhol",
  historia: "História",
  geografia: "Geografia",
  sociologia: "Sociologia",
  filosofia: "Filosofia",
  biologia: "Biologia",
  fisica: "Física",
  quimica: "Química",
  matematica: "Matemática",
};

function setupMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const userMenu = document.getElementById("user-menu");
  const body = document.body;

  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  function toggleMenu() {
    const isOpen = menuToggle.classList.contains("active");

    if (!isOpen) {
      // Abrir menu
      menuToggle.classList.add("active");
      mainNav.classList.add("active");
      userMenu.classList.add("active");
      overlay.classList.add("active");
      body.classList.add("menu-open");
    } else {
      closeMenu();
    }
  }

  function closeMenu() {
    menuToggle.classList.remove("active");
    mainNav.classList.remove("active");
    userMenu.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("menu-open");
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  overlay.addEventListener("click", closeMenu);

  const navLinks = document.querySelectorAll(".mobile-menu .nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        closeMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();

  fetch("/api/usuario")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("nomeUsuario").textContent = data.nickname;

      if (data.tipo === "ADMIN") {
        const linkMaterias = document.getElementById("link-materias");
        linkMaterias.style.display = "block";

        const saudacao = document.querySelector(".saudacao h1");
        const badge = document.createElement("span");
        badge.className = "badge-ADMIN";
        badge.textContent = "ADMINISTRADOR";
        saudacao.appendChild(badge);
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do usuário:", error);
    });

  loadEstatisticasInicio();
});

async function loadEstatisticasInicio() {
  try {
    const [responseGeral, responseDisciplinas] = await Promise.all([
      fetch("/api/estatisticas"),
      fetch("/api/estatisticas-disciplinas"),
    ]);

    const statsGeral = await responseGeral.json();
    const statsDisciplinas = await responseDisciplinas.json();

    generateChartInicio(statsGeral);
    updateNivelDesempenho(statsGeral);

    // Chama a nova função de recomendação
    updateDisciplinaAtencao(statsDisciplinas);
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
    // Em caso de erro, exibir gráfico vazio e traço na recomendação
    generateChartInicio({
      matematica: { total: 0, acertos: 0 },
      linguagens: { total: 0, acertos: 0 },
      humanas: { total: 0, acertos: 0 },
      natureza: { total: 0, acertos: 0 },
    });
    document.getElementById("disciplina-atencao").textContent = "-";
  }
}

// NOVA FUNÇÃO LÓGICA: Determina a disciplina que precisa de atenção
function updateDisciplinaAtencao(statsDisciplinas) {
  const elementoAlvo = document.getElementById("disciplina-atencao");
  let todasDisciplinas = [];

  // 1. Aplanar os dados: extrair disciplinas de dentro das áreas
  Object.keys(statsDisciplinas).forEach((area) => {
    const disciplinasDaArea = statsDisciplinas[area];

    if (disciplinasDaArea) {
      Object.keys(disciplinasDaArea).forEach((disciplinaKey) => {
        const dados = disciplinasDaArea[disciplinaKey];

        // Só consideramos disciplinas que o aluno realmente tentou responder
        if (dados.total > 0) {
          todasDisciplinas.push({
            chave: disciplinaKey,
            nome: nomesDisciplinas[disciplinaKey] || disciplinaKey,
            total: dados.total,
            acertos: dados.acertos,
            taxaAcerto: dados.acertos / dados.total,
          });
        }
      });
    }
  });

  // 2. Regra: Se tiver menos de 3 matérias respondidas
  if (todasDisciplinas.length < 3) {
    elementoAlvo.textContent = "Responda mais flashcards para receber feedback";
    elementoAlvo.style.fontSize = "0.9rem";
    elementoAlvo.style.lineHeight = "1.2";
    return;
  }

  // 3. Regra: Ordenar pela menor taxa de acerto
  todasDisciplinas.sort((a, b) => {
    if (a.taxaAcerto === b.taxaAcerto) {
      // Desempate: quem tem mais erros absolutos vem primeiro (é mais urgente)
      const errosA = a.total - a.acertos;
      const errosB = b.total - b.acertos;
      return errosB - errosA;
    }
    return a.taxaAcerto - b.taxaAcerto; // Menor % primeiro
  });

  const piorDisciplina = todasDisciplinas[0];

  elementoAlvo.textContent = piorDisciplina.nome;

  // Reseta estilos caso tenham sido alterados
  elementoAlvo.style.fontSize = "";
  elementoAlvo.style.lineHeight = "";
  if (piorDisciplina.taxaAcerto < 0.5) {
    elementoAlvo.style.color = "#ff4444";
  } else {
    elementoAlvo.style.color = "";
  }
}

function updateNivelDesempenho(stats) {
  const totalQuestoes =
    stats.matematica.total +
    stats.linguagens.total +
    stats.humanas.total +
    stats.natureza.total;

  const totalAcertos =
    stats.matematica.acertos +
    stats.linguagens.acertos +
    stats.humanas.acertos +
    stats.natureza.acertos;

  let nivel = "Iniciante";
  let cor = "#ff6b6b";

  if (totalQuestoes > 0) {
    const percentual = (totalAcertos / totalQuestoes) * 100;

    if (percentual >= 80) {
      nivel = "Excelente";
      cor = "#2ecc71";
    } else if (percentual >= 60) {
      nivel = "Bom";
      cor = "#3498db";
    } else if (percentual >= 40) {
      nivel = "Médio";
      cor = "#f39c12";
    } else if (percentual >= 20) {
      nivel = "Básico";
      cor = "#e67e22";
    } else {
      nivel = "Iniciante";
      cor = "#ff6b6b";
    }
  }

  const nivelElement = document.getElementById("nivel-desempenho");
  nivelElement.textContent = nivel;
  nivelElement.style.color = cor;
  nivelElement.style.fontWeight = "bold";
}

function generateChartInicio(stats) {
  const chartContainer = document.getElementById("chart-container-inicio");

  // Calcular percentuais
  const percentuais = {
    matematica:
      stats.matematica.total > 0
        ? Math.round((stats.matematica.acertos / stats.matematica.total) * 100)
        : 0,
    linguagens:
      stats.linguagens.total > 0
        ? Math.round((stats.linguagens.acertos / stats.linguagens.total) * 100)
        : 0,
    humanas:
      stats.humanas.total > 0
        ? Math.round((stats.humanas.acertos / stats.humanas.total) * 100)
        : 0,
    natureza:
      stats.natureza.total > 0
        ? Math.round((stats.natureza.acertos / stats.natureza.total) * 100)
        : 0,
  };

  // Verificar se há dados
  const totalQuestoes =
    stats.matematica.total +
    stats.linguagens.total +
    stats.humanas.total +
    stats.natureza.total;

  if (totalQuestoes === 0) {
    chartContainer.innerHTML = `
            <div class="sem-dados">
                <p>Você ainda não respondeu nenhum flashcard.</p>
                <p><a href="/flashcards">Começar a praticar agora!</a></p>
            </div>
        `;
    return;
  }

  chartContainer.innerHTML = "";

  // Criar linhas guia de fundo
  const linhasGuia = document.createElement("div");
  linhasGuia.className = "linhas-guia";
  for (let i = 0; i <= 100; i += 25) {
    const linha = document.createElement("div");
    linha.className = "linha-guia";
    linha.style.bottom = `${i}%`;
    linhasGuia.appendChild(linha);
  }
  chartContainer.appendChild(linhasGuia);

  // Criar eixo Y
  const eixoY = document.createElement("div");
  eixoY.className = "eixo-y";
  for (let i = 100; i >= 0; i -= 25) {
    const yLabel = document.createElement("div");
    yLabel.className = "axis-y-label";
    yLabel.textContent = `${i}%`;
    eixoY.appendChild(yLabel);
  }

  // Criar container das barras
  const barrasContainer = document.createElement("div");
  barrasContainer.className = "barras-container";

  // Criar barras
  const materias = [
    {
      tipo: "matematica",
      nome: "Matemática",
      percentual: percentuais.matematica,
    },
    {
      tipo: "linguagens",
      nome: "Linguagens",
      percentual: percentuais.linguagens,
    },
    { tipo: "humanas", nome: "Humanas", percentual: percentuais.humanas },
    {
      tipo: "natureza",
      nome: "Natureza",
      percentual: percentuais.natureza,
    },
  ];

  materias.forEach((materia) => {
    const barraItem = document.createElement("div");
    barraItem.className = "barra-item";

    const barraValor = document.createElement("div");
    barraValor.className = "barra-valor";
    barraValor.textContent = `${materia.percentual}%`;

    const barra = document.createElement("div");
    barra.className = `barra barra-${materia.tipo}`;
    barra.style.height = `${materia.percentual}%`;
    barra.title = `${materia.nome}: ${materia.percentual}% de acerto`;

    const barraRotulo = document.createElement("div");
    barraRotulo.className = "barra-rotulo";
    barraRotulo.textContent = materia.nome;

    barraItem.appendChild(barraValor);
    barraItem.appendChild(barra);
    barraItem.appendChild(barraRotulo);

    barrasContainer.appendChild(barraItem);
  });

  chartContainer.appendChild(eixoY);
  chartContainer.appendChild(barrasContainer);
}
