let hrs = document.getElementById('hrs');
let min = document.getElementById('min');
let sec = document.getElementById('sec');
let ampm = document.getElementById('ampm');
let toggleBtn = document.getElementById("toggle-format");

let is24Hour = false;

setInterval(() => {
    let now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();

     let displayHour = h;
    let period = "";

    if (!is24Hour) {
        period = h >= 12 ? "PM" : "AM";
        displayHour = h % 12;
        displayHour = displayHour === 0 ? 12 : displayHour;
    }

    hrs.innerHTML = displayHour.toString().padStart(2, '0');
    min.innerHTML = m.toString().padStart(2, '0');
    sec.innerHTML = s.toString().padStart(2, '0');
     ampm.innerHTML = is24Hour ? "" : period;
},1000);

toggleBtn.addEventListener("click", () => {
    if (is24Hour === false) {
        is24Hour = true;
        toggleBtn.textContent = "Switch to 12-hour";
    } else {
        is24Hour = false;
        toggleBtn.textContent = "Switch to 24-hour";
    }
});
