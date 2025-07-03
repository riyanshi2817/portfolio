let word1 = document.getElementById('word1');
let word2 = document.getElementById('word2');
let checkbtn = document.getElementById('checkbtn');
let result = document.getElementById('result');

checkbtn.addEventListener("click", () => {
    let firstword = word1.value.toLowerCase().replace(/[^a-z]/g, "").trim();
    console.log(`firstword = ${word1}`);


    let secondword = word2.value.toLowerCase().replace(/[^a-z]/g, "").trim();
    console.log(`secondword = ${word1}`);

    if (firstword.length !== secondword.length) {
        result.innerText = "Not anagrams";
        result.style.color = "red";
        return;
    }

    let sorted1 = firstword.split("").sort().join("");
    let sorted2 = secondword.split("").sort().join("");

    if (sorted1 === sorted2) {
        result.innerText = "They are anagrams";
        result.style.color = "green";
    } else {
        result.innerText = "Not anagrams";
        result.style.color = "red";
    }


});

document.addEventListener("keydown" ,  function(e){
     if (e.key === "Enter") {
        checkbtn.click(); 
    }
});
