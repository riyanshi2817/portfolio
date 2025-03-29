// // let str = "  Hello World!  ";
// // console.log(str.trim());           
// // console.log(str.toUpperCase());    
// // console.log(str.includes("World")); 
// // console.log(str.split(" "));     
// // let user = { name: "John", age: 30 };
// // console.log(Object.keys(user));   // ["name", "age"]
// // console.log(Object.values(user)); // ["John", 30]
// // console.log(Object.entries(user)); // [["name", "John"], ["age", 30]]

// // user.city = "New York";  // Add new property
// // delete user.age;         // Remove property
// // console.log(user);
// // let numbers = [1, 2, 3, 4];

// // numbers.forEach(num => console.log(num * 2)); 
// let numbers = [1, 2, 3, 4];

// let squaredNumbers = numbers.map(num => num * num);
// console.log(squaredNumbers); 

let  container = document.getElementsByClassName("container")[0];
let  box = document.getElementsByClassName("box")[0];
let  innerbox = document.getElementsByClassName("innerbox")[0];

container.addEventListener("click" ,function(e)
{
    alert("container is clicked");
},true)

box.addEventListener("click" ,function(e)
{
    alert("box is clicked");
},true)

innerbox.addEventListener("click" ,function(e)
{
    alert("innerbox is clicked");
},true)