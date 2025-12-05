const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const counterDisplay = document.getElementById("counter");
let timerInterval = null;
let isRunning = false;
let totalSeconds = 0;

startButton.addEventListener("click", () => {
    if(isRunning){
        clearInterval(timerInterval);
        isRunning = false;
        startButton.textContent = "Começar";
    }
    else{
        timerInterval = setInterval(incrementCounter, 1000);
        isRunning = true;
        startButton.textContent = "Pausar"; 
    }
})

resetButton.addEventListener("click", () => {
    clearInterval(timerInterval);
    totalSeconds = 0;
    counterDisplay.textContent = formatSecondsToTime(totalSeconds);
    startButton.disabled = false; // Habilita o botão iniciar novamente
}) 

function incrementCounter(){
    totalSeconds++;
    counterDisplay.textContent = formatSecondsToTime(totalSeconds);
}

function formatSecondsToTime(seconds){
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60; 
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
