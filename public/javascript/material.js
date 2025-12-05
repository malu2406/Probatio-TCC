document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/usuario")
    .then((response) => response.json())
    .then((data) => {
      if (data.tipo === "BOLSISTA") {
        const linkMaterias = document.getElementById("link-materias");
        if (linkMaterias) linkMaterias.style.display = "block";
      } else {
        window.location.href = "/inicio";
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do usuário:", error);
    });

  const form = document.getElementById("flashcardForm");
  const editForm = document.getElementById("editFlashcardForm");
  const successMessage = document.getElementById("successMessage");
  const flashcardsContainer = document.getElementById("flashcardsContainer");
  const editModal = document.getElementById("editModal");
  const closeModal = document.querySelector(".close");
  const cancelEdit = document.getElementById("cancelEdit");

  // ================================================================= //
  // >> INÍCIO DO CÓDIGO NOVO PARA OS CAMPOS DE SELEÇÃO <<
  // ================================================================= //

  // Obtenha os elementos dos formulários
  const materiaSelect = document.getElementById("materia");
  const conteudoSelect = document.getElementById("conteudo");
  const editMateriaSelect = document.getElementById("editMateria");
  const editConteudoSelect = document.getElementById("editConteudo");

  // Mapeamento das matérias para os conteúdos (padrão ENEM)
  const conteudosPorMateria = {
    CH: [
      { value: "historia", text: "História" },
      { value: "geografia", text: "Geografia" },
      { value: "sociologia", text: "Sociologia" },
      { value: "filosofia", text: "Filosofia" },
    ],
    CN: [
      { value: "biologia", text: "Biologia" },
      { value: "fisica", text: "Física" },
      { value: "quimica", text: "Química" },
    ],
    LINGUAGENS: [
      { value: "portugues", text: "Português" },
      { value: "ingles", text: "Inglês" },
      { value: "espanhol", text: "Espanhol" },
    ],
    MATEMATICA: [{ value: "matematica", text: "Matemática" }],
  };

  // Função para atualizar as opções de conteúdo
  function atualizarConteudos(materiaSelecionada, selectDeConteudo) {
    selectDeConteudo.innerHTML = "";

    const optionPadrao = document.createElement("option");
    optionPadrao.value = "";
    optionPadrao.textContent = "Selecione o conteúdo";
    selectDeConteudo.appendChild(optionPadrao);

    const conteudos = conteudosPorMateria[materiaSelecionada] || [];

    if (conteudos.length > 0) {
      selectDeConteudo.disabled = false;
      conteudos.forEach(function (conteudo) {
        const option = document.createElement("option");
        option.value = conteudo.value;
        option.textContent = conteudo.text;
        selectDeConteudo.appendChild(option);
      });
    } else {
      selectDeConteudo.disabled = true;
      optionPadrao.textContent = "Primeiro, selecione a matéria";
    }
  }

  // Adiciona o "ouvinte" de eventos para o formulário principal
  materiaSelect.addEventListener("change", function () {
    atualizarConteudos(this.value, conteudoSelect);
  });

  // Adiciona o "ouvinte" de eventos para o modal de edição
  editMateriaSelect.addEventListener("change", function () {
    atualizarConteudos(this.value, editConteudoSelect);
  });

  // ================================================================= //
  // >> FIM DO CÓDIGO NOVO <<
  // ================================================================= //

  // Carregar flashcards existentes
  loadFlashcards();

  // Criar flashcard
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      materia: document.getElementById("materia").value,
      conteudo: document.getElementById("conteudo").value,
      pergunta: document.getElementById("pergunta").value,
      resposta: document.getElementById("resposta").value,
    };

    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        successMessage.style.display = "block";
        form.reset();
        // Reseta e desabilita o campo de conteúdo após criar
        conteudoSelect.innerHTML =
          '<option value="">Primeiro, selecione a matéria</option>';
        conteudoSelect.disabled = true;
        loadFlashcards();

        setTimeout(() => {
          successMessage.style.display = "none";
        }, 3000);
      } else {
        alert("Erro ao criar flashcard");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar flashcard");
    }
  });

  // MODIFICADO: Esta função foi reescrita para funcionar com o código novo
  function setupEditButton(button, flashcard) {
    button.addEventListener("click", function () {
      document.getElementById("editFlashcardId").value = flashcard.id;
      editMateriaSelect.value = flashcard.materia;

      // Chame a função para popular os conteúdos corretos antes de selecionar
      atualizarConteudos(flashcard.materia, editConteudoSelect);

      editConteudoSelect.value = flashcard.conteudo; // Agora seleciona o conteúdo correto

      document.getElementById("editPergunta").value = flashcard.pergunta;
      document.getElementById("editResposta").value = flashcard.resposta;
      editModal.style.display = "block";
    });
  }

  // Excluir flashcard
  function setupDeleteButton(button, flashcardId) {
    button.addEventListener("click", async function () {
      if (confirm("Tem certeza que deseja excluir este flashcard?")) {
        try {
          const response = await fetch(`/api/flashcards/${flashcardId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            loadFlashcards();
          } else {
            alert("Erro ao excluir flashcard");
          }
        } catch (error) {
          console.error("Erro:", error);
          alert("Erro ao excluir flashcard");
        }
      }
    });
  }

  // Salvar edição
  editForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const flashcardId = document.getElementById("editFlashcardId").value;
    const formData = {
      materia: document.getElementById("editMateria").value,
      conteudo: document.getElementById("editConteudo").value,
      pergunta: document.getElementById("editPergunta").value,
      resposta: document.getElementById("editResposta").value,
    };

    try {
      const response = await fetch(`/api/flashcards/${flashcardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        editModal.style.display = "none";
        loadFlashcards();
      } else {
        alert("Erro ao atualizar flashcard");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar flashcard");
    }
  });

  // Fechar modal
  closeModal.addEventListener("click", function () {
    editModal.style.display = "none";
  });

  cancelEdit.addEventListener("click", function () {
    editModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === editModal) {
      editModal.style.display = "none";
    }
  });

  // Carregar flashcards
  async function loadFlashcards() {
    try {
      const response = await fetch("/api/flashcards");
      const flashcards = await response.json();
      flashcardsContainer.innerHTML = "";

      if (flashcards.length === 0) {
        flashcardsContainer.innerHTML = "<p>Nenhum flashcard criado ainda.</p>";
        return;
      }

      flashcards.forEach((flashcard) => {
        const flashcardElement = document.createElement("div");
        flashcardElement.className = "flashcard-item";

        const materiaNames = {
          CH: "Ciências Humanas",
          CN: "Ciências da Natureza",
          LINGUAGENS: "Linguagens",
          MATEMATICA: "Matemática",
        };

        flashcardElement.innerHTML = `
                <div class="flashcard-materia">${
                  materiaNames[flashcard.materia] || flashcard.materia
                }</div>
                <div class="flashcard-conteudo">Conteúdo: ${
                  flashcard.conteudo
                }</div>
                <div class="flashcard-pergunta"><strong>P:</strong> ${
                  flashcard.pergunta
                }</div>
                <div class="flashcard-resposta"><strong>R:</strong> ${
                  flashcard.resposta
                }</div>
                <div class="flashcard-actions">
                  <button class="btn-editar" data-id="${
                    flashcard.id
                  }">Editar</button>
                  <button class="btn-excluir" data-id="${
                    flashcard.id
                  }">Excluir</button>
                </div>`;

        flashcardsContainer.appendChild(flashcardElement);

        const editButton = flashcardElement.querySelector(".btn-editar");
        const deleteButton = flashcardElement.querySelector(".btn-excluir");

        setupEditButton(editButton, flashcard);
        setupDeleteButton(deleteButton, flashcard.id);
      });
    } catch (error) {
      console.error("Erro ao carregar flashcards:", error);
    }
  }
});
