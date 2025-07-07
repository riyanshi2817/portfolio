let hrs = document.getElementById('hrs');
let min = document.getElementById('min');
let sec = document.getElementById('sec');
const buttons = document.querySelectorAll('.btn');

let hours = 0;
let minutes = 0;
let seconds = 0;
let timer = null;
let isRunning = false;

function updateDisplay() {
    hrs.textContent = hours.toString().padStart(2, '0');
    min.textContent = minutes.toString().padStart(2, '0');
    sec.textContent = seconds.toString().padStart(2, '0');
}

function start() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                seconds = 0;
                minutes++;
                if (minutes === 60) {
                    minutes = 0;
                    hours++;
                }
            }
            updateDisplay();
        }, 1000);
    }
}

function stop() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
}

function reset() {
    stop();
    hours = 0;
    minutes = 0;
    seconds = 0;
    updateDisplay();
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.toLowerCase();
        
        if (buttonText === 'start') {
            start();
        } else if (buttonText === 'stop') {
            stop();
        } else if (buttonText === 'reset') {
            reset();
        }
    });
});

updateDisplay();