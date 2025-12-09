// Variável global para guardar os dados atuais do usuário (para preencher o modal)
let currentUserData = {};

document.addEventListener("DOMContentLoaded", function () {
  // 1. Configurar menu mobile
  setupMobileMenu();

  // 2. Elementos do DOM (Visualização)
  const nomeDisplay = document.getElementById("nomeDisplay");
  const emailDisplay = document.getElementById("emailDisplay");
  const nicknameDisplay = document.getElementById("nicknameDisplay");

  // 3. Elementos do Modal (Edição)
  const modal = document.getElementById("edit-profile-modal");
  const btnEditar = document.getElementById("btn-editar-perfil");
  const btnFechar = document.getElementById("close-modal-btn");
  const btnSalvar = document.getElementById("save-profile-btn");

  // Inputs do Formulário
  const inputNome = document.getElementById("edit-nome");
  const inputNickname = document.getElementById("edit-nickname");
  const inputEmail = document.getElementById("edit-email");
  const inputSenha = document.getElementById("edit-senha");

  // 4. Carregar dados ao iniciar a página
  carregarUsuario();

  // --- FUNÇÕES E EVENTOS ---

  // Função para buscar dados do servidor e atualizar a tela
  async function carregarUsuario() {
    try {
      const res = await fetch("/api/usuario");
      const user = await res.json();

      // Salva na variável global para usar no modal quando clicar em editar
      currentUserData = user;

      // Atualiza os textos na tela de perfil
      if (nomeDisplay) nomeDisplay.innerText = user.nome;
      if (emailDisplay) emailDisplay.innerText = user.email;
      if (nicknameDisplay) nicknameDisplay.innerText = user.nickname;

      // Lógica específica para BOLSISTA (mostrar link de material)
      if (user.tipo === "BOLSISTA") {
        const linkMaterias = document.getElementById("link-materias");
        if (linkMaterias) linkMaterias.style.display = "block";
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  }

  // Evento: Abrir Modal ao clicar no botão de editar
  if (btnEditar) {
    btnEditar.addEventListener("click", () => {
      // Preenche os inputs com os dados que já temos
      inputNome.value = currentUserData.nome || "";
      inputNickname.value = currentUserData.nickname || "";
      inputEmail.value = currentUserData.email || "";
      inputSenha.value = ""; // Senha sempre vazia por segurança

      // Remove a classe hidden para mostrar o modal
      modal.classList.remove("hidden");
    });
  }

  // Evento: Fechar Modal ao clicar no X
  if (btnFechar) {
    btnFechar.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Evento: Fechar Modal ao clicar fora da caixa (no fundo escuro)
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Evento: Salvar Alterações (Enviar para o Backend)
  if (btnSalvar) {
    btnSalvar.addEventListener("click", async () => {
      // Pega os valores dos inputs
      const novosDados = {
        nome: inputNome.value,
        nickname: inputNickname.value,
        email: inputEmail.value,
        senha: inputSenha.value,
      };

      try {
        const response = await fetch("/api/usuario", {
          method: "PUT", // Método PUT para atualização
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novosDados),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Perfil atualizado com sucesso!");
          modal.classList.add("hidden"); // Fecha o modal
          carregarUsuario(); // Recarrega os dados na tela para mostrar o novo nome/email
        } else {
          alert("Erro: " + (data.error || "Não foi possível atualizar."));
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao conectar com o servidor.");
      }
    });
  }
});

// Função padrão do Menu Mobile (igual aos outros arquivos do projeto)
function setupMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const userMenu = document.getElementById("user-menu");
  const body = document.body;

  // Evita erro se não encontrar o menu na página
  if (!menuToggle) return;

  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  function toggleMenu() {
    const isOpen = menuToggle.classList.contains("active");

    if (!isOpen) {
      menuToggle.classList.add("active");
      mainNav.classList.add("active");
      if (userMenu) userMenu.classList.add("active");
      overlay.classList.add("active");
      body.classList.add("menu-open");
    } else {
      closeMenu();
    }
  }

  function closeMenu() {
    menuToggle.classList.remove("active");
    mainNav.classList.remove("active");
    if (userMenu) userMenu.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("menu-open");
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  overlay.addEventListener("click", closeMenu);

  // Fecha menu ao redimensionar tela
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}