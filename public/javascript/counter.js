const pomodoroSelect = document.querySelector('#pomodoro');
const shortBreakSelect = document.querySelector('#short-break');
const longBreakSelect = document.querySelector('#long-break');
const startButton = document.querySelector('#start');
const resetButton = document.querySelector('#reset'); // Adicionado seletor que faltava
const timerParagraph = document.querySelector('#counter');

let selectedTimer = "pomodoro"; // pomodoro, short-break, long-break
let timerInterval = null;
let isRunning = false;
let remainingSeconds = getTimerValue(selectedTimer);

// Inicializa o mostrador com o valor correto ao carregar a página
timerParagraph.textContent = secondsToMinutesSeconds(remainingSeconds);

function changeSelectClasses(timer) {
    if(timer === "pomodoro") {
        pomodoroSelect.classList.add("active-button");
        shortBreakSelect.classList.remove("active-button");
        longBreakSelect.classList.remove("active-button");
    } else if (timer === "short-break") {
        pomodoroSelect.classList.remove("active-button");
        shortBreakSelect.classList.add("active-button");
        longBreakSelect.classList.remove("active-button");
    } else if (timer === "long-break") {
        pomodoroSelect.classList.remove("active-button");
        shortBreakSelect.classList.remove("active-button");
        longBreakSelect.classList.add("active-button");
    } 
}

// LÓGICA ALTERADA: Agora busca do localStorage
function getTimerValue(timer) {
    // Busca as configurações salvas ou usa o padrão se não existir
    const savedSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15
    };

    let minutes = 25;

    // Mapeia o tipo de timer para a propriedade correta do objeto settings
    if (timer === "pomodoro") {
        minutes = savedSettings.pomodoro;
    } else if (timer === "short-break") {
        minutes = savedSettings.shortBreak; // Nota: no JS é camelCase (shortBreak), na string do timer é kebab-case
    } else if (timer === "long-break") {
        minutes = savedSettings.longBreak;
    }

    return minutes * 60;
}

function secondsToMinutesSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const padSeconds = seconds.toString().padStart(2,"0");
    return `${minutes}:${padSeconds}`; 
}

function changeTimerValue(timer) {
    remainingSeconds = getTimerValue(timer);
    timerParagraph.textContent = secondsToMinutesSeconds(remainingSeconds);
    document.title = `${secondsToMinutesSeconds(remainingSeconds)} | Pomodoro 🍅`;
}

function selectTimer(timer) {
    // Se o timer estiver rodando, pare antes de mudar
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startButton.textContent = "Começar";
    }
    
    selectedTimer = timer;
    changeSelectClasses(timer);
    changeTimerValue(timer);
}

// Unifiquei a lógica de Start/Pause em uma função principal
function startTimer(timer) {
    if (!isRunning) {
        // Iniciar ou retomar o timer
        startButton.textContent = "Pausar";
        isRunning = true;
        
        timerInterval = setInterval(() => {
            remainingSeconds--;
            
            timerParagraph.textContent = secondsToMinutesSeconds(remainingSeconds);
            document.title = `${secondsToMinutesSeconds(remainingSeconds)} | Pomodoro 🍅`;
            
            if (remainingSeconds <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                startButton.textContent = "Começar";
                
                // Opcional: tocar som de notificação aqui
                // const audio = new Audio('/sounds/alarm.mp3');
                // audio.play();
                
                remainingSeconds = 0; // Garante que não fique negativo
            }
        }, 1000);
    } else {
        // Pausar o timer
        clearInterval(timerInterval);
        isRunning = false;
        startButton.textContent = "Retomar";
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startButton.textContent = "Começar";
    changeTimerValue(selectedTimer);
}

// Event Listeners
pomodoroSelect.addEventListener('click', () => {
    selectTimer('pomodoro');
});

shortBreakSelect.addEventListener('click', () => {
    selectTimer('short-break');
});

longBreakSelect.addEventListener('click', () => {
    selectTimer('long-break');
});

// Apenas clique simples para iniciar/pausar (removi o dblclick para evitar confusão com o clique simples)
startButton.addEventListener('click', () => {
    // O argumento 'timer' não é usado dentro de startTimer, mas mantive a assinatura
    startTimer(selectedTimer);
});

if (resetButton) {
    resetButton.addEventListener('click', resetTimer);
}




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
