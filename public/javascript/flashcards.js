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

//function dos filtros

function filtrosFlashcards() {
  const filtrosMobileToggle = document.getElementById("filtrosMobileToggle");
  const filtrosWrapper = document.getElementById("filtrosWrapper");
  const filtroGroups = document.querySelectorAll(".filtro-group");
  const limparFiltrosBtn = document.getElementById("limparFiltros");
  const contadorTotal = document.getElementById("contadorTotal");

  let filtrosAtivos = {
    materia: "todas",
    status: "todas",
  };

  const isMobile = window.innerWidth <= 900;

  if (filtrosMobileToggle && filtrosWrapper) {
    if (isMobile) {
      filtrosMobileToggle.classList.remove("active");
      filtrosWrapper.classList.remove("active");
    } else {
      filtrosMobileToggle.style.display = "none";
      filtrosWrapper.classList.add("active");
      filtrosWrapper.style.display = "flex";
    }

    filtrosMobileToggle.addEventListener("click", () => {
      if (isMobile) {
        filtrosMobileToggle.classList.toggle("active");
        filtrosWrapper.classList.toggle("active");

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

  filtroGroups.forEach((group) => {
    const header = group.querySelector(".filtro-header");
    const content = group.querySelector(".filtro-content");
    const toggleIcon = group.querySelector(".toggle-icon");

    if (isMobile) {
      group.classList.remove("active");
      content.style.display = "none";
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
      group.classList.add("active");
      content.style.display = "block";
      if (toggleIcon) {
        toggleIcon.style.display = "none";
      }
    }
  });

  const filtroBtns = document.querySelectorAll(".filtro-btn");
  const filtroStatusBtns = document.querySelectorAll(".filtro-status-btn");

  filtroBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtroBtns.forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      filtrosAtivos.materia = btn.getAttribute("data-materia");
      aplicarFiltrosImediatamente();

      if (isMobile && filtrosMobileToggle) {
        filtrosMobileToggle.classList.remove("active");
        filtrosWrapper.classList.remove("active");
      }
    });
  });

  filtroStatusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtroStatusBtns.forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      filtrosAtivos.status = btn.getAttribute("data-status");
      aplicarFiltrosImediatamente();

      if (isMobile && filtrosMobileToggle) {
        filtrosMobileToggle.classList.remove("active");
        filtrosWrapper.classList.remove("active");
      }
    });
  });

  if (limparFiltrosBtn) {
    limparFiltrosBtn.addEventListener("click", () => {
      const todasMateria = document.querySelector(
        '.filtro-btn[data-materia="todas"]'
      );
      if (todasMateria) {
        filtroBtns.forEach((b) => b.classList.remove("ativo"));
        todasMateria.classList.add("ativo");
        filtrosAtivos.materia = "todas";
      }

      const todasStatus = document.querySelector(
        '.filtro-status-btn[data-status="todas"]'
      );
      if (todasStatus) {
        filtroStatusBtns.forEach((b) => b.classList.remove("ativo"));
        todasStatus.classList.add("ativo");
        filtrosAtivos.status = "todas";
      }

      const flashcards = document.querySelectorAll(".flashcard");
      flashcards.forEach((card) => {
        card.style.display = "flex";
      });

      aplicarFiltrosImediatamente();

      limparFiltrosBtn.innerHTML =
        '<span class="material-icons">check</span> Filtros Limpos';
      setTimeout(() => {
        limparFiltrosBtn.innerHTML =
          '<span class="material-icons">clear_all</span> Limpar Filtros';
      }, 2000);
    });
  }

  function aplicarFiltrosImediatamente() {
    const flashcards = document.querySelectorAll(".flashcard");
    const materia = filtrosAtivos.materia;
    const status = filtrosAtivos.status;

    flashcards.forEach((card) => {
      const cardMateria = card.getAttribute("data-materia");
      const cardId = card.getAttribute("data-id");
      let mostraPorMateria = materia === "todas" || cardMateria === materia;
      let mostraPorStatus = true;

      if (status !== "todas") {
        const temClasseAcerto = card.classList.contains("respondida-acerto");
        const temClasseErro = card.classList.contains("respondida-erro");
        const jaRespondida = temClasseAcerto || temClasseErro;

        switch (status) {
          case "nao-respondidas":
            mostraPorStatus = !jaRespondida;
            break;
          case "respondidas":
            mostraPorStatus = jaRespondida;
            break;
          case "acertadas":
            mostraPorStatus = temClasseAcerto;
            break;
          case "erradas":
            mostraPorStatus = temClasseErro;
            break;
        }
      }

      card.style.display =
        mostraPorMateria && mostraPorStatus ? "flex" : "none";
    });

    updateContador();
  }

  function updateContador() {
    const flashcards = document.querySelectorAll(".flashcard");
    const visiveis = Array.from(flashcards).filter(
      (card) => card.style.display !== "none"
    ).length;

    contadorTotal.textContent = `${visiveis} flashcards encontrados`;
  }

  window.addEventListener("resize", () => {
    const newIsMobile = window.innerWidth <= 900;
    if (isMobile !== newIsMobile) {
      location.reload();
    }
  });

  return { aplicarFiltrosImediatamente, updateContador };
}

document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();

  const { aplicarFiltrosImediatamente, updateContador } = filtrosFlashcards();

  let todasQuestoes = [];
  let historicoRespostas = {};
  let userId = null;

  fetch("/api/usuario")
    .then((resposta) => resposta.json())
    .then((data) => {
      userId = data.id;
      if (data.tipo === "ADMIN") {
        const linkMaterias = document.getElementById("link-materias");
        if (linkMaterias) linkMaterias.style.display = "block";
      }
      Promise.all([loadFlashcardsFromDB(), loadHistoricoRespostas()]).then(
        () => {
          exibirFlashcards();
          aplicarFiltrosImediatamente();
        }
      );
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do usuário:", error);
    });

  updateStatsDisplay();

  //exibe todos mais mais flashcards🦆
  async function loadFlashcardsFromDB() {
    try {
      const resposta = await fetch("/api/todos-flashcards");
      todasQuestoes = await resposta.json();
    } catch (error) {
      console.error("Erro ao carregar flashcards:", error);
    }
  }

  // se acertou ou errou🦆
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

  //se ele responder dnv, salva dnv no localstorage

  function salvarResposta(flashcardId, acertou) {
    if (!userId) return;

    historicoRespostas[flashcardId] = {
      acertou: acertou,
      data: new Date().toISOString(),
      userId: userId,
    };

    const chaveUsuario = `historicoRespostas_${userId}`;
    localStorage.setItem(chaveUsuario, JSON.stringify(historicoRespostas));

    console.log("Resposta salva para usuário:", userId, flashcardId, acertou);
  }

  //converte os nomes babadeiros

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

  //agora sim exibe todos os flashcards babilonicos com html fofinho🦆

  function exibirFlashcards() {
    const container = document.getElementById("flashcardsContainer");
    container.innerHTML = "";
    //aqui é só caso eu reinicie o banco e perca todos meus flashcards, dai aparece mensagem dizendo que deu ruim
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

    interacoesFlashcards();
    updateContador();
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

  //salva se ele acertou, acertou==true errou igual acertou==false

  function interacoesFlashcards() {
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

        registrarResposta(materia, conteudo, true);
        salvarResposta(flashcardId, true);
        card.classList.add("respondida-acerto");
        card.style.display = "none";
        updateContador();
      });
    });

    errouButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const card = e.target.closest(".flashcard");
        const materia = card.getAttribute("data-materia");
        const conteudo = card.getAttribute("data-conteudo");
        const flashcardId = card.getAttribute("data-id");

        registrarResposta(materia, conteudo, false);
        salvarResposta(flashcardId, false);
        card.classList.add("respondida-erro");
        card.style.display = "none";
        updateContador();
      });
    });
  }

  async function registrarResposta(materiaFrontend, conteudo, acertou) {
    try {
      const materiaMapToBackend = {
        matematica: "matematica",
        linguagens: "linguagens",
        humanas: "humanas",
        natureza: "natureza",
      };

      const materiaBackend =
        materiaMapToBackend[materiaFrontend] || materiaFrontend;

      const resposta = await fetch("/api/estatisticas", {
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
      console.error("Erro ao registrar resposta:", error);
    }
  }

  async function updateStatsDisplay() {
    try {
      const resposta = await fetch("/api/estatisticas");
      const stats = await resposta.json();

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
