const input = document.getElementById('inp');
const btn = document.querySelectorAll('.btn');
const del = document.querySelector('.del');
const clear = document.querySelector('.clr');
const equal = document.querySelector('.equals');

btn.forEach((btn) => {
    btn.addEventListener('click', () => {
        input.value += btn.textContent
    })
});

del.addEventListener("click" , () => {
    input.value = input.value.slice(0, -1);
});

clear.addEventListener("click" , () => {
    input.value = "";
});

equal.addEventListener("click" , () => {
    input.value = eval(input.value);
});

