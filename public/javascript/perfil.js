let currentUserData = {};

document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();

  const nomeDisplay = document.getElementById("nomeDisplay");
  const emailDisplay = document.getElementById("emailDisplay");
  const nicknameDisplay = document.getElementById("nicknameDisplay");

  const modal = document.getElementById("edit-profile-modal");
  const btnEditar = document.getElementById("btn-editar-perfil");
  const btnFechar = document.getElementById("close-modal-btn");
  const btnSalvar = document.getElementById("save-profile-btn");

  const inputNome = document.getElementById("edit-nome");
  const inputNickname = document.getElementById("edit-nickname");
  const inputEmail = document.getElementById("edit-email");
  const inputSenha = document.getElementById("edit-senha");

  carregarUsuario();

  async function carregarUsuario() {
    try {
      const res = await fetch("/api/usuario");
      const user = await res.json();

      currentUserData = user;

      if (nomeDisplay) nomeDisplay.innerText = user.nome;
      if (emailDisplay) emailDisplay.innerText = user.email;
      if (nicknameDisplay) nicknameDisplay.innerText = user.nickname;

      if (user.tipo === "BOLSISTA") {
        const linkMaterias = document.getElementById("link-materias");
        if (linkMaterias) linkMaterias.style.display = "block";
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  }

  if (btnEditar) {
    btnEditar.addEventListener("click", () => {
      inputNome.value = currentUserData.nome || "";
      inputNickname.value = currentUserData.nickname || "";
      inputEmail.value = currentUserData.email || "";
      inputSenha.value = ""; // vazia 

      modal.classList.remove("hidden");
    });
  }

  if (btnFechar) {
    btnFechar.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });


  if (btnSalvar) {
    btnSalvar.addEventListener("click", async () => {
      const novosDados = {
        nome: inputNome.value,
        nickname: inputNickname.value,
        email: inputEmail.value,
        senha: inputSenha.value,
      };

      try {
        const response = await fetch("/api/usuario", {
          method: "PUT", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novosDados),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Perfil atualizado com sucesso!");
          modal.classList.add("hidden"); 

          carregarUsuario(); //recarregar dados atualizados
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

function setupMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const userMenu = document.getElementById("user-menu");
  const body = document.body;

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

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}