let textarea = document.getElementById('textarea');
let btns = document.querySelectorAll('.btns button');
let output = document.getElementById('output');

btns.forEach((btn, index) => {
 btn.addEventListener("click", () => {
    let text = textarea.value;

    if (index === 0) {
      textarea.value = text.toUpperCase();
    } else if (index === 1) {
      textarea.value = text.toLowerCase();
    } else if (index === 2) {
      textarea.value = text.replace(/\s+/g, ' ').trim();
    } else if (index === 3) {
      textarea.value = text.replace(/\n{2,}/g, '\n').trim();
    } else if (index === 4) {
      let charCount = text.length;
      let wordCount = text.trim().split(/\s+/).filter(word => word).length;
      output.innerHTML = `
        <p><strong>Characters:</strong> ${charCount}</p>
        <p><strong>Words:</strong> ${wordCount}</p>
      `;
    } else if (index === 5) {
      textarea.value = "";
      output.innerHTML = "";
    }
  });
});
    // btn[0].addEventListener("click", () => {
    //    
    // });

    // btn[1].addEventListener("click", () => {
    //     const lowercase = textarea.value.toLowercase();

    // });

    // btn[2].addEventListener("click", () => {
    //     const extrspace = textarea.value.trim();

    // });

    // btn[3].addEventListener("click", () => {

    // });

    // btn[4].addEventListener("click", () => {

    // });

    // btn[5].addEventListener("click", () => {

    // });



