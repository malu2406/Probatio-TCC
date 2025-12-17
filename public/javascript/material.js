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

document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();

  fetch("/api/usuario")
    .then((resposta) => resposta.json())
    .then((data) => {
      if (data.tipo === "ADMIN") {
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

  const materiaSelect = document.getElementById("materia");
  const conteudoSelect = document.getElementById("conteudo");
  const editMateriaSelect = document.getElementById("editMateria");
  const editConteudoSelect = document.getElementById("editConteudo");

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

  materiaSelect.addEventListener("change", function () {
    atualizarConteudos(this.value, conteudoSelect);
  });

  editMateriaSelect.addEventListener("change", function () {
    atualizarConteudos(this.value, editConteudoSelect);
  });

  loadFlashcards();

  //create flashcard

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      materia: document.getElementById("materia").value,
      conteudo: document.getElementById("conteudo").value,
      pergunta: document.getElementById("pergunta").value,
      resposta: document.getElementById("resposta").value,
    };

    try {
      const resposta = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (resposta.ok) {
        successMessage.style.display = "block";
        form.reset();
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

  //edit do flashcard

  function setupEditButton(button, flashcard) {
    button.addEventListener("click", function () {
      document.getElementById("editFlashcardId").value = flashcard.id;
      editMateriaSelect.value = flashcard.materia;

      atualizarConteudos(flashcard.materia, editConteudoSelect);

      editConteudoSelect.value = flashcard.conteudo;

      document.getElementById("editPergunta").value = flashcard.pergunta;
      document.getElementById("editResposta").value = flashcard.resposta;
      editModal.style.display = "block";
    });
  }

  //delet do flashcard

  function setupDeleteButton(button, flashcardId) {
    button.addEventListener("click", async function () {
      if (confirm("Tem certeza que deseja excluir este flashcard?")) {
        try {
          const resposta = await fetch(`/api/flashcards/${flashcardId}`, {
            method: "DELETE",
          });
          if (resposta.ok) {
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
      const resposta = await fetch(`/api/flashcards/${flashcardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (resposta.ok) {
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
      const resposta = await fetch("/api/flashcards");
      const flashcards = await resposta.json();
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
