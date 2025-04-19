document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generateBtn");
    const changeThemeBtn = document.getElementById("changeTheme");
    const inputField = document.querySelector(".inputBtn");
    const container = document.querySelector(".container");
    function generatePassword(length =8) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    }
    generateBtn.addEventListener("click", function () {
        inputField.value = generatePassword();
    });
    changeThemeBtn.addEventListener("click", function () {
        container.classList.toggle("dark-theme");
    });
});

