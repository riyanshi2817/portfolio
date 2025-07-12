const btn = document.getElementById('btn1');
const tareef = document.querySelector('.tareef');
const startPage = document.querySelector('.startpage');
const happyLine = document.getElementById('happyLine');
const loveLine = document.getElementById('loveLine');
const restMsg = document.getElementById('restMsg');
const img1 = document.getElementById('img1');
const music = document.getElementById('bgMusic');
const imagePage = document.querySelector('.imagepage');

btn.addEventListener('click', () => {
    startPage.style.display = 'none';
    tareef.style.display = 'block';

    music.play();

    setTimeout(() => {
        happyLine.style.display = 'none';
        img1.style.display = 'none';
        loveLine.style.display = 'block';
    }, 4000);

    setTimeout(() => {
        loveLine.style.display = 'none';
        restMsg.style.display = 'block';

        const paragraphs = restMsg.querySelectorAll('p:not(.last-line)');
        const lastLine = restMsg.querySelector('.last-line');

        paragraphs.forEach((p, index) => {
            setTimeout(() => {
                p.classList.add('show');
            }, index * 800);
        });

        setTimeout(() => {
            if (lastLine) {
                lastLine.classList.add('show');
            }

            setTimeout(() => {
                tareef.style.display = 'none';
                imagePage.style.display = 'flex';
            }, 2500);

        }, paragraphs.length * 800 + 1000);

    }, 8000);
});
