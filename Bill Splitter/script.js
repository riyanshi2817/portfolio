let billl = document.getElementById("billl");
let tipbtn = document.getElementsByClassName("tipbtn");
let customtip = document.getElementById("custip");
let npeople = document.getElementById("people");
let genebtn = document.getElementById("genebtn");
let selectedTip = null;
let resetbtn = document.getElementById("rebtn");


for (let i = 0; i < tipbtn.length; i++) {
    tipbtn[i].addEventListener("click", function () {
        selectedTip = parseFloat(this.value);
        customtip.value = ""; // Clear custom tip if a button is selected

        for (let j = 0; j < tipbtn.length; j++) {
            tipbtn[j].classList.remove("selected");
        }
        this.classList.add("selected");
    });
}

genebtn.addEventListener("click", function () {
    let billValue = parseFloat(billl.value);
    let customti = parseFloat(customtip.value);
    let peopleCount = parseInt(npeople.value);

    let tipPercent = !isNaN(customti)
        ? customti
        : selectedTip !== null
            ? selectedTip
            : 0;
    if (isNaN(billValue) || isNaN(peopleCount) || peopleCount <= 0) {
        alert("Please enter valid bill and number of people.");
        return;
    }
    let tipAmount = (billValue * tipPercent) / 100;

    let totalBill = tipAmount + billValue;

    let eachPerson = totalBill / peopleCount;

    document.getElementById("tipamt").innerText = `₹${tipAmount.toFixed(2)}`;
    document.getElementById("totalamt").innerText = `₹${totalBill.toFixed(2)}`;
    document.getElementById("eachamt").innerText = `₹${eachPerson.toFixed(2)}`;
});


resetbtn.addEventListener("click", function () {
    
    billl.value = "";
    customtip.value = "";
    npeople.value = "";

    document.getElementById("tipamt").innerText = "₹0.00";
    document.getElementById("totalamt").innerText = "₹0.00";
    document.getElementById("eachamt").innerText = "₹0.00";

    for (let i = 0; i < tipbtn.length; i++) {
        tipbtn[i].classList.remove("selected");
    }

    selectedTip = null;
});
