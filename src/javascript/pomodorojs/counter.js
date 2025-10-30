const pomodoroSelect = document.querySelector('#pomodoro');
const shortBreakSelect = document.querySelector('#short-break');
const longBreakSelect = document.querySelector('#long-break');
const startButton = document.querySelector('#start');
const timerParagraph = document.querySelector('#counter');

let selectedTimer = "pomodoro"; //pomodoro, short-break, long-break

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
        pomodoro: "25:00",
        "short-break": "05:00",
        "long-break": "15:00",
    }[timer];
}

function changeTimerValue(timer) {
    timerParagraph.textContent = getTimerValue(timer);
}

function selectTimer(timer) {
    selectedTimer = timer;

    changeSelectClasses(timer);
    changeTimerValue(timer);
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