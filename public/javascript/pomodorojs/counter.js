const pomodoroSelect = document.querySelector('#pomodoro');
const shortBreakSelect = document.querySelector('#short-break');
const longBreakSelect = document.querySelector('#long-break');
const startButton = document.querySelector('#start');
const timerParagraph = document.querySelector('#counter');

let selectedTimer = "pomodoro"; //pomodoro, short-break, long-break
let timerInterval = null;
let isRunning = false;
let remainingSeconds = getTimerValue(selectedTimer);

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
    return {
        pomodoro: 25 * 60,
        "short-break": 5 * 60,
        "long-break": 15 * 60,
    }[timer];
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

function startPauseTimer() {
    if (!isRunning) {
        startButton.textContent = "Pausar";
        isRunning = true;
        
        timerInterval = setInterval(() => {
            remainingSeconds--;
            
            timerParagraph.textContent = secondsToMinutesSeconds(remainingSeconds);
            document.title = `${secondsToMinutesSeconds(remainingSeconds)} | Pomodoro 🍅`;
            
            if (remainingSeconds === 0) {
                clearInterval(timerInterval);
                isRunning = false;
                startButton.textContent = "Começar";
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

startButton.addEventListener('dblclick', () => {
    clearInterval(timerInterval);
    isRunning = false;
    startButton.textContent = "Começar";
    changeTimerValue(selectedTimer);
});

resetButton.addEventListener('click', resetTimer);


function startTimer(timer) {
    if (!isRunning) {
        // Iniciar ou retomar o timer
        startButton.textContent = "Pausar";
        isRunning = true;
        
        timerInterval = setInterval(() => {
            remainingSeconds--;
            
            timerParagraph.textContent = secondsToMinutesSeconds(remainingSeconds);
            document.title = `${secondsToMinutesSeconds(remainingSeconds)} | Pomodoro 🍅`;
            
            if (remainingSeconds === 0) {
                clearInterval(timerInterval);
                isRunning = false;
                startButton.textContent = "Começar";
                // Opcional: tocar som de notificação
            }
        }, 1000);
    } else {
        // Pausar o timer
        clearInterval(timerInterval);
        isRunning = false;
        startButton.textContent = "Retomar";
    }
}

// Função para reiniciar o timer
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startButton.textContent = "Começar";
    remainingSeconds = getTimerValue(selectedTimer);
    timerParagraph.textContent = secondsToMinutesSeconds(remainingSeconds);
    document.title = `${secondsToMinutesSeconds(remainingSeconds)} | Pomodoro 🍅`;
}