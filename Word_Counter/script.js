let textarea = document.getElementById('textarea');
let countbtn = document.getElementById('countbtn');
let count = document.getElementById('count');

let inputtext = textarea.value
let countWords = () => {
    let text = textarea.value.trim();
    let words = text.split(/\s+/);

    let wordCount = words.filter(word => word !== "").length;
    count.innerText = `No. of words: ${wordCount}`;
    // let wordCount = 0;

    // for (let i = 0; i < words.length; i++) {
    //     if (words[i] !== "") {
    //         wordCount++;
    //     }
    // }

    // count.innerText = `No. of words: ${wordCount}`;
};
countbtn.addEventListener("click", countWords);
