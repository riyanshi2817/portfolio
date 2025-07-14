const btn = document.getElementById('btn1');
const startPage = document.querySelector('.startpage');
const tareef = document.querySelector('.tareef');
const happyLine = document.getElementById('happyLine');
const img1 = document.getElementById('img1');
const loveLine = document.getElementById('loveLine');
const img2 = document.getElementById('img2');
const restMsg = document.getElementById('restMsg');
const imagePage = document.querySelector('.imagepage');
const finalPage = document.querySelector('.finalpage');
const music = document.getElementById('bgMusic');

btn.addEventListener('click', () => {
  startPage.style.display = 'none';
  tareef.style.display = 'block';
  music.play();

  // Happy Birthday section (30s)
  setTimeout(() => {
    happyLine.style.display = 'block';
    img1.classList.add('show');
  }, 500);

  setTimeout(() => {
    happyLine.style.display = 'none';
    img1.classList.remove('show');
    loveLine.style.display = 'block';
    img2.classList.add('show');
  }, 30500);

  // I Love You section (30s)
  setTimeout(() => {
    loveLine.style.display = 'none';
    img2.classList.remove('show');
    restMsg.style.display = 'block';

    const paragraphs = restMsg.querySelectorAll('p:not(.last-line)');
    const lastLine = restMsg.querySelector('.last-line');

    // Show paragraphs one by one
    paragraphs.forEach((p, index) => {
      setTimeout(() => {
        p.classList.add('show');
      }, index * 800);
    });

    // Show the last line at the end of all paragraphs
    const paraTime = paragraphs.length * 800;
    setTimeout(() => {
      if (lastLine) {
        lastLine.classList.add('show');
      }
    }, paraTime + 500); // small gap after all paras

    // 🕐 WAIT 90 seconds (1 min 30s) from the START of showing messages
    // So, delay next section by full 90, not based on animation time
    setTimeout(() => {
      tareef.style.display = 'none';
      imagePage.style.display = 'flex';
    }, 90000); // from this point, hold for 90s

  }, 60500); // Messages start after 30+30s = 60.5s

  setTimeout(() => {
    imagePage.style.display = 'none';
    finalPage.style.display = 'flex';
  }, 60500 + 90000 + 60000); // messages start + 90s + 60s

  setTimeout(() => {
    console.log('Presentation finished');
  }, 60500 + 90000 + 60000 + 30000);
});
