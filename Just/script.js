const btn = document.getElementById('btn1');
const tareef = document.querySelector('.tareef');
const startPage = document.querySelector('.startpage');
const happyLine = document.getElementById('happyLine');
const loveLine = document.getElementById('loveLine');
const restMsg = document.getElementById('restMsg');

btn.addEventListener('click', () => {
    startPage.style.display = 'none';
    tareef.style.display = 'block';

    setTimeout(() => {
        happyLine.style.display = 'none';
        loveLine.style.display = 'block';

    }, 20000);
    setTimeout(() => {
        loveLine.style.display = 'none';
        restMsg.style.display = 'block';

    }, 20000);
});
