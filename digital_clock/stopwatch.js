// Get all the elements
const hrsElement = document.getElementById('hrs');
const minElement = document.getElementById('min');
const secElement = document.getElementById('sec');
const buttons = document.querySelectorAll('.btn');

// Initialize variables
let hours = 0;
let minutes = 0;
let seconds = 0;
let timer = null;
let isRunning = false;

// Function to update the stopwatch display
function updateDisplay() {
    hrsElement.textContent = hours.toString().padStart(2, '0');
    minElement.textContent = minutes.toString().padStart(2, '0');
    secElement.textContent = seconds.toString().padStart(2, '0');
}

// Function to start the stopwatch
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

// Function to stop the stopwatch
function stop() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
}

// Function to reset the stopwatch
function reset() {
    stop();
    hours = 0;
    minutes = 0;
    seconds = 0;
    updateDisplay();
}

// Add event listeners to buttons
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

// Initialize display
updateDisplay();