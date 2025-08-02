const passwordField = document.querySelector(".password");
const rangeInput = document.querySelector(".limit");
const lengthOutput = document.querySelector(".length");
const includeNumbers = document.getElementById("numCheck");
const includeLetters = document.getElementById("charCheck");
const includeSymbols = document.getElementById("SymbolCheck");
const generateBtn = document.querySelector(".btn");
const copyBtn = document.querySelector(".copyBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{}|;:',.<>?/";

lengthOutput.textContent = `Length  :  ${rangeInput.value}`;

rangeInput.addEventListener("input", () => {
  lengthOutput.textContent = `Length  :  ${rangeInput.value}`;
});

function generatePassword() {
  let chars = "";

  if (includeLetters.checked) chars += letters;
  if (includeNumbers.checked) chars += numbers;
  if (includeSymbols.checked) chars += symbols;

  if (chars === "") {
    alert("Please select at least one option (Letters, Numbers, or Symbols).");
    return;
  }

  const length = +rangeInput.value;
  let password = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * chars.length);
    password += chars[index];
  }
  passwordField.value = password;
}

copyBtn.addEventListener("click", () => {
  const password = passwordField.value;
  if (password !== "") {
    navigator.clipboard.writeText(password);
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 1500);
  }
});

generateBtn.addEventListener("click", generatePassword);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    generatePassword();
  }
});


toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
