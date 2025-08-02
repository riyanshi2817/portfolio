const passwordField = document.querySelector(".password");
const rangeInput = document.querySelector(".limit");
const lengthOutput = document.querySelector(".length");
const includeNumbers = document.getElementById("numCheck");
const includeSymbols = document.getElementById("charCheck");
const generateBtn = document.querySelector(".btn");
const copyBtn = document.qureySelecctor(".copyBtn");

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{}|;:',.<>?/";

lengthOutput.textContent = `Length  :  ${rangeInput.value}`;

rangeInput.addEventListener("input", () => {
    lengthOutput.textcontent = `Length  :  ${rangeInput.value}`;
});

function generatePassword() {
    let chars = "";

    if (includeNumbers.checked) chars += numbers;
    if (includeSymbols.checked) chars += symbols;

    if(chars ===)
}
generateBtn.addEventListener("click", generatePassword);
generateBtn.addEventListener("enter", generatePassword);
