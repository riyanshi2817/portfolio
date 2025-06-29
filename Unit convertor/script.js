function convert(){

    let input = document.querySelector("#number").value;
    let fromunit = document.querySelector("#fromunit").value;
    let tounit = document.querySelector("#tounit").value;
    
    if (isNaN(input) || input === "") {
      document.getElementById("res").innerText = "Please enter a valid number.";
      return;
    }
    
    input = parseFloat(input);
    
    const toMeters = {
      centimeter: 0.01,
      meter: 1,
      kilometer: 1000,
      feet: 0.3048,
      inch: 0.0254,
      mile: 1609.344
    };
    
    let valueInMeters = input * toMeters[fromunit];
    
    let finalValue = valueInMeters / toMeters[tounit];
    
    document.getElementById("res").innerText =`Result: ${finalValue.toFixed(4)} ${tounit}`;
}

document.getElementById("convertBtn").addEventListener("click" , convert);