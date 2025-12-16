const pomodoroSelect = document.querySelector('#pomodoro');
const shortBreakSelect = document.querySelector('#short-break');
const longBreakSelect = document.querySelector('#long-break');
const startButton = document.querySelector('#start');
const resetButton = document.querySelector('#reset'); 
const timerParagraph = document.querySelector('#counter');

let selectedTimer = "pomodoro"; // pomodoro, short-break, long-break
let timerInterval = null;
let isRunning = false;
let remainingSeconds = getTimerValue(selectedTimer);

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

function getTimerValue(timer) {
    const savedSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15
    };

    let minutes = 25;

    if (timer === "pomodoro") {
        minutes = savedSettings.pomodoro;
    } else if (timer === "short-break") {
        minutes = savedSettings.shortBreak; 
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
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startButton.textContent = "Começar";
    }
    
    selectedTimer = timer;
    changeSelectClasses(timer);
    changeTimerValue(timer);
}

function startTimer(timer) {
    if (!isRunning) {
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
                
                remainingSeconds = 0; 
            }
        }, 1000);
    } else {
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

pomodoroSelect.addEventListener('click', () => {
    selectTimer('pomodoro');
});

shortBreakSelect.addEventListener('click', () => {
    selectTimer('short-break');
});

longBreakSelect.addEventListener('click', () => {
    selectTimer('long-break');
});

startButton.addEventListener('click', () => {
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
function setupMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const userMenu = document.getElementById("user-menu");
  const body = document.body;

  const mobileOverlay = document.createElement("div");
  mobileOverlay.className = "mobile-menu-overlay";
  document.body.appendChild(mobileOverlay);

  function toggleMenu() {
    const isOpen = menuToggle.classList.contains("active");

    if (!isOpen) {
      menuToggle.classList.add("active");
      mainNav.classList.add("active");
      userMenu.classList.add("active");
      mobileOverlay.classList.add("active");
      body.classList.add("menu-open");
    } else {
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

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  mobileOverlay.addEventListener("click", closeMenu);

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
