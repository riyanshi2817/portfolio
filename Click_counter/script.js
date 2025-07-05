let btn = document.getElementById('btn');
let result = document.querySelector('.result');
let resetBtn = document.getElementById('resetBtn');
let count = 0;

btn.addEventListener("click" , () => {
    count++;
    result.textContent = count;
});

resetBtn.addEventListener("click", () => {
    count = 0;
    result.textContent = count;
});