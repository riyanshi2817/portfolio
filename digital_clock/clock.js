// const clock = document.querySelector(".clock");
// setInterval(()=>{
//     clock.innerHTML = new Date().toLocaleTimeString()
// },1000)




let hrs = document.getElementById("hrs");
let min = document.getElementById("min");
let sec = document.getElementById("sec");


setInterval(() => {
    let currentTime = new Date();
    let currenthour = currentTime.getHours()%12;
    
    if(currenthour===0) currenthour=12;
    // hrs.innerHTML = (currentTime.getHours()<10?"0":"") + currentTime.get.getHours();
    // min.innerHTML = (currentTime.getMinutes()<10?"0":"") + currentTime.get.getMinutes();
    // sec.innerHTML =  (currentTime.getSeconds()<10?"0":"") + currentTime.get.getSeconds();
    hrs.innerHTML = currenthour.toString().padStart(2,"0");
    min.innerHTML = currentTime.getMinutes().toString().padStart(2,"0");
    sec.innerHTML = currentTime.getSeconds().toString().padStart(2,"0");
}, 1000);

