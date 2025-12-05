// Função para controlar o menu mobile
function setupMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const userMenu = document.getElementById("user-menu");
  const body = document.body;

  // Criar overlay
  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  // Função para abrir/fechar o menu
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
      // Fechar menu
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

  // Event listeners
  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  overlay.addEventListener("click", closeMenu);

  // Fechar menu ao clicar em um link (para mobile)
  const navLinks = document.querySelectorAll(".mobile-menu .nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        closeMenu();
      }
    });
  });

  // Fechar menu ao redimensionar a janela para tamanho maior
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

// Função para controlar os filtros modernos
function setupModernFilters() {
  const filtrosMobileToggle = document.getElementById("filtrosMobileToggle");
  const filtrosWrapper = document.getElementById("filtrosWrapper");
  const filtroGroups = document.querySelectorAll(".filtro-group");
  const limparFiltrosBtn = document.getElementById("limparFiltros");
  const contadorTotal = document.getElementById("contadorTotal");

  let filtrosAtivos = {
    materia: "todas",
    status: "todas",
  };

  // Verificar se estamos em mobile
  const isMobile = window.innerWidth <= 900;

  // Toggle do menu de filtros em mobile
  if (filtrosMobileToggle && filtrosWrapper) {
    if (isMobile) {
      // Em mobile, começa fechado
      filtrosMobileToggle.classList.remove("active");
      filtrosWrapper.classList.remove("active");
    } else {
      // Em desktop, sempre visível
      filtrosMobileToggle.style.display = "none";
      filtrosWrapper.classList.add("active");
      filtrosWrapper.style.display = "flex";
    }

    filtrosMobileToggle.addEventListener("click", () => {
      if (isMobile) {
        filtrosMobileToggle.classList.toggle("active");
        filtrosWrapper.classList.toggle("active");

        // Scroll suave para mostrar os filtros
        if (filtrosWrapper.classList.contains("active")) {
          setTimeout(() => {
            filtrosWrapper.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }, 300);
        }
      }
    });
  }

  // Configurar comportamento dos grupos de filtros
  filtroGroups.forEach((group) => {
    const header = group.querySelector(".filtro-header");
    const content = group.querySelector(".filtro-content");
    const toggleIcon = group.querySelector(".toggle-icon");

    if (isMobile) {
      // Em mobile, grupos começam fechados
      group.classList.remove("active");
      content.style.display = "none";

      // Adicionar evento de clique para expandir/recolher
      header.addEventListener("click", () => {
        group.classList.toggle("active");

        if (content.style.display === "block") {
          content.style.display = "none";
          if (toggleIcon) {
            toggleIcon.style.transform = "rotate(0deg)";
          }
        } else {
          content.style.display = "block";
          if (toggleIcon) {
            toggleIcon.style.transform = "rotate(180deg)";
          }
        }
      });
    } else {
      // Em desktop, grupos sempre expandidos
      group.classList.add("active");
      content.style.display = "block";
      if (toggleIcon) {
        toggleIcon.style.display = "none";
      }
    }
  });

  // Configurar botões de filtro
  const filtroBtns = document.querySelectorAll(".filtro-btn");
  const filtroStatusBtns = document.querySelectorAll(".filtro-status-btn");

  // Selecionar filtro de matéria - APLICA IMEDIATAMENTE
  filtroBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtroBtns.forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      filtrosAtivos.materia = btn.getAttribute("data-materia");
      aplicarFiltrosImediatamente();

      // Em mobile, fechar menu de filtros após seleção
      if (isMobile && filtrosMobileToggle) {
        filtrosMobileToggle.classList.remove("active");
        filtrosWrapper.classList.remove("active");
      }
    });
  });

  // Selecionar filtro de status - APLICA IMEDIATAMENTE
  filtroStatusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtroStatusBtns.forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      filtrosAtivos.status = btn.getAttribute("data-status");
      aplicarFiltrosImediatamente();

      // Em mobile, fechar menu de filtros após seleção
      if (isMobile && filtrosMobileToggle) {
        filtrosMobileToggle.classList.remove("active");
        filtrosWrapper.classList.remove("active");
      }
    });
  });

  // Botão limpar filtros
  if (limparFiltrosBtn) {
    limparFiltrosBtn.addEventListener("click", () => {
      // Resetar filtros de matéria
      const todasMateria = document.querySelector(
        '.filtro-btn[data-materia="todas"]'
      );
      if (todasMateria) {
        filtroBtns.forEach((b) => b.classList.remove("ativo"));
        todasMateria.classList.add("ativo");
        filtrosAtivos.materia = "todas";
      }

      // Resetar filtros de status
      const todasStatus = document.querySelector(
        '.filtro-status-btn[data-status="todas"]'
      );
      if (todasStatus) {
        filtroStatusBtns.forEach((b) => b.classList.remove("ativo"));
        todasStatus.classList.add("ativo");
        filtrosAtivos.status = "todas";
      }

      aplicarFiltrosImediatamente();

      // Feedback visual
      limparFiltrosBtn.innerHTML =
        '<span class="material-icons">check</span> Filtros Limpos';
      setTimeout(() => {
        limparFiltrosBtn.innerHTML =
          '<span class="material-icons">clear_all</span> Limpar Filtros';
      }, 2000);
    });
  }

  // Função para aplicar filtros e atualizar contador IMEDIATAMENTE
  function aplicarFiltrosImediatamente() {
    filterFlashcards(filtrosAtivos.materia);
    filterByStatus(filtrosAtivos.status);
    updateContador();
  }

  // Atualizar contador
  function updateContador() {
    const flashcards = document.querySelectorAll(".flashcard");
    const visiveis = Array.from(flashcards).filter(
      (card) => card.style.display !== "none" && card.style.display !== ""
    ).length;

    contadorTotal.textContent = `${visiveis} flashcards encontrados`;
  }

  // Lidar com redimensionamento da janela
  window.addEventListener("resize", () => {
    // Se mudou de mobile para desktop ou vice-versa, recarregar a página para garantir comportamento correto
    const newIsMobile = window.innerWidth <= 900;
    if (isMobile !== newIsMobile) {
      location.reload();
    }
  });

  return { aplicarFiltrosImediatamente, updateContador };
}

document.addEventListener("DOMContentLoaded", function () {
  // Configurar menu mobile
  setupMobileMenu();

  // Configurar filtros modernos
  const { aplicarFiltrosImediatamente, updateContador } = setupModernFilters();

  let todasQuestoes = [];
  let historicoRespostas = {};
  let userId = null;

  fetch("/api/usuario")
    .then((response) => response.json())
    .then((data) => {
      userId = data.id;
      if (data.tipo === "BOLSISTA") {
        const linkMaterias = document.getElementById("link-materias");
        if (linkMaterias) linkMaterias.style.display = "block";
      }
      Promise.all([loadFlashcardsFromDB(), loadHistoricoRespostas()]).then(
        () => {
          exibirFlashcards();
          aplicarFiltrosImediatamente(); // Aplicar filtros iniciais
        }
      );
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do usuário:", error);
    });

  updateStatsDisplay();

  async function loadFlashcardsFromDB() {
    try {
      const response = await fetch("/api/todos-flashcards");
      todasQuestoes = await response.json();
    } catch (error) {
      console.error("Erro ao carregar flashcards:", error);
    }
  }

  async function loadHistoricoRespostas() {
    try {
      if (!userId) return;

      const chaveUsuario = `historicoRespostas_${userId}`;
      const dadosSalvos = localStorage.getItem(chaveUsuario);

      if (dadosSalvos) {
        historicoRespostas = JSON.parse(dadosSalvos);
      } else {
        historicoRespostas = {};
      }

      console.log(
        "Histórico carregado para usuário:",
        userId,
        historicoRespostas
      );
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      historicoRespostas = {};
    }
  }

  function salvarResposta(flashcardId, acertou) {
    if (!userId) return;

    historicoRespostas[flashcardId] = {
      acertou: acertou,
      data: new Date().toISOString(),
      userId: userId,
    };

    const chaveUsuario = `historicoRespostas_${userId}`;
    localStorage.setItem(chaveUsuario, JSON.stringify(historicoRespostas));

    console.log(" Resposta salva para usuário:", userId, flashcardId, acertou);
  }

  function mapearNomeConteudo(value) {
    const mapeamento = {
      historia: "História",
      geografia: "Geografia",
      sociologia: "Sociologia",
      filosofia: "Filosofia",
      biologia: "Biologia",
      fisica: "Física",
      quimica: "Química",
      portugues: "Português",
      ingles: "Inglês",
      espanhol: "Espanhol",
      matematica: "Matemática",
    };
    return mapeamento[value] || value;
  }

  function exibirFlashcards() {
    const container = document.getElementById("flashcardsContainer");
    container.innerHTML = "";

    if (todasQuestoes.length === 0) {
      container.innerHTML =
        '<div class="no-flashcards">' +
        '<span class="material-icons" style="font-size: 48px; color: #6c757d; margin-bottom: 20px;">collections_bookmark</span>' +
        "<h3>Nenhum flashcard disponível no momento.</h3>" +
        "<p>Crie seus primeiros flashcards para começar a estudar!</p>" +
        "</div>";
      return;
    }

    todasQuestoes.forEach((flashcard) => {
      const flashcardElement = createFlashcardElement(flashcard);
      container.appendChild(flashcardElement);
    });

    reapplyEventListeners();
  }

  function createFlashcardElement(flashcard) {
    const div = document.createElement("div");
    div.className = "flashcard";

    const materiaMap = {
      CH: "humanas",
      CN: "natureza",
      LINGUAGENS: "linguagens",
      MATEMATICA: "matematica",
    };

    const materiaClass = materiaMap[flashcard.materia] || "humanas";
    const materiaNames = {
      CH: "Ciências Humanas",
      CN: "Ciências da Natureza",
      LINGUAGENS: "Linguagens",
      MATEMATICA: "Matemática",
    };

    div.setAttribute("data-materia", materiaClass);
    div.setAttribute("data-conteudo", flashcard.conteudo);
    div.setAttribute("data-id", flashcard.id);

    const resposta = historicoRespostas[flashcard.id];
    const jaRespondida = !!resposta && resposta.userId === userId;
    const acertou = resposta ? resposta.acertou : false;

    if (jaRespondida) {
      div.classList.add(acertou ? "respondida-acerto" : "respondida-erro");
    }

    div.innerHTML = `
            <span class="materia-tag ${materiaClass}">${
      materiaNames[flashcard.materia] || flashcard.materia
    }</span>
            ${
              jaRespondida
                ? `<div class="status-indicator ${
                    acertou ? "acerto" : "erro"
                  }">${acertou ? "✓ Acertou" : "✗ Errou"}</div>`
                : ""
            }
            <div class="conteudo-tag">${mapearNomeConteudo(
              flashcard.conteudo
            )}</div>
            <div class="pergunta">${flashcard.pergunta}</div>
            <div class="resposta">${flashcard.resposta}</div>
            <div class="controles">
                <button class="btn mostrar-resposta">Mostrar Resposta</button>
                <div class="feedback-buttons" style="display: none">
                    <button class="btn acertou">Acertou</button>
                    <button class="btn errou">Errou</button>
                </div>
            </div>
        `;

    return div;
  }

  function reapplyEventListeners() {
    // Mostrar/ocultar respostas
    const mostrarRespostaButtons =
      document.querySelectorAll(".mostrar-resposta");
    mostrarRespostaButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const card = e.target.closest(".flashcard");
        const resposta = card.querySelector(".resposta");
        const feedbackButtons = card.querySelector(".feedback-buttons");

        resposta.style.display = "block";
        feedbackButtons.style.display = "flex";
        button.style.display = "none";
      });
    });

    const acertouButtons = document.querySelectorAll(".acertou");
    const errouButtons = document.querySelectorAll(".errou");

    acertouButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const card = e.target.closest(".flashcard");
        const materia = card.getAttribute("data-materia");
        const conteudo = card.getAttribute("data-conteudo");
        const flashcardId = card.getAttribute("data-id");

        registerAnswer(materia, conteudo, true);
        salvarResposta(flashcardId, true);
        card.classList.add("respondida-acerto");
        card.style.display = "none";
        aplicarFiltrosImediatamente();
        updateContador();
      });
    });

    errouButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const card = e.target.closest(".flashcard");
        const materia = card.getAttribute("data-materia");
        const conteudo = card.getAttribute("data-conteudo");
        const flashcardId = card.getAttribute("data-id");

        registerAnswer(materia, conteudo, false);
        salvarResposta(flashcardId, false);
        card.classList.add("respondida-erro");
        card.style.display = "none";
        aplicarFiltrosImediatamente();
        updateContador();
      });
    });
  }

  function filterFlashcards(materia) {
    const flashcards = document.querySelectorAll(".flashcard");
    flashcards.forEach((card) => {
      if (
        materia === "todas" ||
        card.getAttribute("data-materia") === materia
      ) {
        // Primeiro mostra todos os cards da matéria selecionada
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  function filterByStatus(status) {
    const flashcards = document.querySelectorAll(".flashcard");
    flashcards.forEach((card) => {
      const cardId = card.getAttribute("data-id");
      const resposta = historicoRespostas[cardId];
      const respostaDesteUsuario = resposta && resposta.userId === userId;

      let mostrar = false;

      switch (status) {
        case "todas":
          mostrar = true;
          break;
        case "nao-respondidas":
          mostrar = !respostaDesteUsuario;
          break;
        case "respondidas":
          mostrar = respostaDesteUsuario;
          break;
        case "acertadas":
          mostrar = respostaDesteUsuario && resposta.acertou;
          break;
        case "erradas":
          mostrar = respostaDesteUsuario && !resposta.acertou;
          break;
      }

      // Só aplicar o filtro de status se o card já não estiver escondido pelo filtro de matéria
      if (card.style.display === "flex") {
        card.style.display = mostrar ? "flex" : "none";
      }
    });
  }

  async function registerAnswer(materiaFrontend, conteudo, acertou) {
    try {
      const materiaMapToBackend = {
        matematica: "matematica",
        linguagens: "linguagens",
        humanas: "humanas",
        natureza: "natureza",
      };

      const materiaBackend =
        materiaMapToBackend[materiaFrontend] || materiaFrontend;

      const response = await fetch("/api/estatisticas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materia: materiaBackend,
          disciplina: conteudo,
          acertou: acertou,
        }),
      });

      await updateStatsDisplay();
    } catch (error) {
      console.error(" Erro ao registrar resposta:", error);
    }
  }

  async function updateStatsDisplay() {
    try {
      const response = await fetch("/api/estatisticas");
      const stats = await response.json();

      document.getElementById(
        "stat-matematica"
      ).textContent = `${stats.matematica.acertos}/${stats.matematica.total}`;
      document.getElementById(
        "stat-linguagens"
      ).textContent = `${stats.linguagens.acertos}/${stats.linguagens.total}`;
      document.getElementById(
        "stat-humanas"
      ).textContent = `${stats.humanas.acertos}/${stats.humanas.total}`;
      document.getElementById(
        "stat-natureza"
      ).textContent = `${stats.natureza.acertos}/${stats.natureza.total}`;
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  }
});
