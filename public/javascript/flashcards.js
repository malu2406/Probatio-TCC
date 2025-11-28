document.addEventListener("DOMContentLoaded", function () {
  let todasQuestoes = [];
  let historicoRespostas = {};
  let userId = null; // Variável para armazenar o ID do usuário

  // Primeiro carregamos o usuário para obter o ID
  fetch("/api/usuario")
    .then((response) => response.json())
    .then((data) => {
      userId = data.id; // Armazenamos o ID do usuário
      if (data.tipo === "BOLSISTA") {
        const linkMaterias = document.getElementById("link-materias");
        linkMaterias.style.display = "block";
      }

      // Agora carregamos os dados específicos deste usuário
      Promise.all([loadFlashcardsFromDB(), loadHistoricoRespostas()]).then(
        () => {
          exibirFlashcards();
        }
      );
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do usuário:", error);
    });

  // Filtros por matéria
  const filtroBtns = document.querySelectorAll(".filtro-btn");
  filtroBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtroBtns.forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      const materia = btn.getAttribute("data-materia");
      filterFlashcards(materia);
    });
  });

  // Filtros por status
  const filtroStatusBtns = document.querySelectorAll(".filtro-status-btn");
  filtroStatusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtroStatusBtns.forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      const status = btn.getAttribute("data-status");
      filterByStatus(status);
    });
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

      // CORREÇÃO: Usar o ID do usuário para criar uma chave única
      const chaveUsuario = `historicoRespostas_${userId}`;
      const dadosSalvos = localStorage.getItem(chaveUsuario);

      if (dadosSalvos) {
        historicoRespostas = JSON.parse(dadosSalvos);
      } else {
        historicoRespostas = {};
      }

      console.log(
        "📊 Histórico carregado para usuário:",
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
      userId: userId, // Adicionamos o ID do usuário no registro também
    };

    // CORREÇÃO: Salvar com chave específica do usuário
    const chaveUsuario = `historicoRespostas_${userId}`;
    localStorage.setItem(chaveUsuario, JSON.stringify(historicoRespostas));

    console.log(
      "💾 Resposta salva para usuário:",
      userId,
      flashcardId,
      acertou
    );
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
        '<div class="no-flashcards">Nenhum flashcard disponível no momento.</div>';
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

    // Mapear a matéria para o formato usado no CSS
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

    // Verificar se já foi respondida POR ESTE USUÁRIO
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
            ? `<div class="status-indicator ${acertou ? "acerto" : "erro"}">${
                acertou ? "✓ Acertou" : "✗ Errou"
              }</div>`
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

    // Botões de acerto/erro
    const acertouButtons = document.querySelectorAll(".acertou");
    const errouButtons = document.querySelectorAll(".errou");

    acertouButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const card = e.target.closest(".flashcard");
        const materia = card.getAttribute("data-materia");
        const conteudo = card.getAttribute("data-conteudo");
        const flashcardId = card.getAttribute("data-id");

        console.log("📝 Registrando acerto:", {
          userId,
          materia,
          conteudo,
          flashcardId,
        });
        registerAnswer(materia, conteudo, true);
        salvarResposta(flashcardId, true);
        card.classList.add("respondida-acerto");
        card.style.display = "none";
      });
    });

    errouButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const card = e.target.closest(".flashcard");
        const materia = card.getAttribute("data-materia");
        const conteudo = card.getAttribute("data-conteudo");
        const flashcardId = card.getAttribute("data-id");

        console.log("📝 Registrando erro:", {
          userId,
          materia,
          conteudo,
          flashcardId,
        });
        registerAnswer(materia, conteudo, false);
        salvarResposta(flashcardId, false);
        card.classList.add("respondida-erro");
        card.style.display = "none";
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

      // CORREÇÃO: Verificar se a resposta pertence a este usuário
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

      card.style.display = mostrar ? "flex" : "none";
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

      console.log("🚀 Enviando estatística para API:", {
        materia: materiaBackend,
        disciplina: conteudo,
        acertou: acertou,
      });

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

      const result = await response.json();
      console.log("✅ Resposta da API:", result);
      await updateStatsDisplay();
    } catch (error) {
      console.error("❌ Erro ao registrar resposta:", error);
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
