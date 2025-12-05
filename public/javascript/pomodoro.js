document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/usuario")
    .then((response) => response.json())
    .then((data) => {
      if (data.tipo === "BOLSISTA") {
        const linkMaterias = document.getElementById("link-materias");
        if (linkMaterias) linkMaterias.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do usuário:", error);
    });
});
// FUNÇÃO PARA O MENU RESPONSIVO - ADICIONE ESTA FUNÇÃO NO INÍCIO
function setupMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const userMenu = document.getElementById("user-menu");
  const body = document.body;

  // Criar overlay - usar nome diferente para não conflitar com o modal de configurações
  const mobileOverlay = document.createElement("div");
  mobileOverlay.className = "mobile-menu-overlay";
  document.body.appendChild(mobileOverlay);

  // Função para abrir/fechar o menu
  function toggleMenu() {
    const isOpen = menuToggle.classList.contains("active");

    if (!isOpen) {
      // Abrir menu
      menuToggle.classList.add("active");
      mainNav.classList.add("active");
      userMenu.classList.add("active");
      mobileOverlay.classList.add("active");
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
    mobileOverlay.classList.remove("active");
    body.classList.remove("menu-open");
  }

  // Event listeners
  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  mobileOverlay.addEventListener("click", closeMenu);

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

// AGORA O SEU CÓDIGO ORIGINAL CONTINUA AQUI
document.addEventListener("DOMContentLoaded", function () {
  // Configurar menu mobile - ADICIONE ESTA LINHA
  setupMobileMenu();

  fetch("/api/usuario")
    .then((response) => response.json())
    .then((data) => {
      if (data.tipo === "BOLSISTA") {
        const linkMaterias = document.getElementById("link-materias");
        if (linkMaterias) linkMaterias.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do usuário:", error);
    });
});
