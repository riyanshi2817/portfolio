const display = document.querySelector(".in");            
const copybtn = document.querySelector(".copy");           
const lim = document.querySelector("input[type='range']"); 
const lab = document.querySelector("output");              
const ncheck = document.querySelector("#numCheck");        
const ccheck = document.querySelector("#charCheck");       
const len = document.querySelector("output");               


    lab.textContent = `Length : ${lim.value}`;
lim.addEventListener("input" ,()=>{
    lab.textContent = `Length : ${lim.value}`;
})

copybtn.addEventListener("click", () => {
  if (!display.value) generatePassword();
    display.select();
    display.setSelectionRange(0, 99999); 
    document.execCommand("copy");
    
    const oldText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = oldText, 1000);
});
        
lim.addEventListener("change", generatePassword);            
ncheck.addEventListener("change", generatePassword);         
ccheck.addEventListener("change", generatePassword);   

function generatePassword(){
    const length = parseInt(lim.value , 10);
    const includeNumbers = ncheck.checked;
    const includeSymbols = ccheck.checked;

    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
  if (includeSymbols) chars += "!@#$%^&*()_+[]{}<>?/|";
    if(chars.length ===0){
        display.value = " Select at least one set";
        return;
    }
  let result = "";
  for(let i =0; i<length; i++){
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
  }
  display.value = result;
}