document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const saveBtn = document.getElementById('save-settings-btn');

    const pomodoroInput = document.getElementById('pomodoro-time');
    const shortBreakInput = document.getElementById('short-break-time');
    const longBreakInput = document.getElementById('long-break-time');

    const savedSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15
    };

    pomodoroInput.value = savedSettings.pomodoro;
    shortBreakInput.value = savedSettings.shortBreak;
    longBreakInput.value = savedSettings.longBreak;

    window.pomodoroSettings = savedSettings;

    settingsBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    saveBtn.addEventListener('click', () => {
        const newSettings = {
            pomodoro: parseInt(pomodoroInput.value) || 25,
            shortBreak: parseInt(shortBreakInput.value) || 5,
            longBreak: parseInt(longBreakInput.value) || 15
        };

        localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
        window.location.reload();
    });
});