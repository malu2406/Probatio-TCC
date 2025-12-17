// FUNÇÃO PARA O MENU RESPONSIVO
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

// AGORA O CÓDIGO DO CRONÔMETRO
document.addEventListener("DOMContentLoaded", function () {
  // Configurar menu mobile
  setupMobileMenu();

  // Verificar se usuário é ADMIN e mostrar botão de Material
  fetch("/api/usuario")
    .then((response) => response.json())
    .then((data) => {
      if (data.tipo === "ADMIN") {
        const linkMaterias = document.getElementById("link-materias");
        if (linkMaterias) linkMaterias.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Erro ao verificar tipo de usuário:", error);
    });

  // Código do cronômetro
  const startButton = document.getElementById("start");
  const resetButton = document.getElementById("reset");
  const counterDisplay = document.getElementById("counter");
  let timerInterval = null;
  let isRunning = false;
  let totalSeconds = 0;

  startButton.addEventListener("click", () => {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      startButton.textContent = "Começar";
    } else {
      timerInterval = setInterval(incrementCounter, 1000);
      isRunning = true;
      startButton.textContent = "Pausar";
    }
  });

  resetButton.addEventListener("click", () => {
    clearInterval(timerInterval);
    totalSeconds = 0;
    counterDisplay.textContent = formatSecondsToTime(totalSeconds);
    isRunning = false;
    startButton.textContent = "Começar";
  });

  function incrementCounter() {
    totalSeconds++;
    counterDisplay.textContent = formatSecondsToTime(totalSeconds);
  }

  function formatSecondsToTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(
      2,
      "0"
    )}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
});
