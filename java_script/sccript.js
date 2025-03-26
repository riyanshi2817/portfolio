// let str = "  Hello World!  ";
// console.log(str.trim());           
// console.log(str.toUpperCase());    
// console.log(str.includes("World")); 
// console.log(str.split(" "));     
// let user = { name: "John", age: 30 };
// console.log(Object.keys(user));   // ["name", "age"]
// console.log(Object.values(user)); // ["John", 30]
// console.log(Object.entries(user)); // [["name", "John"], ["age", 30]]

// user.city = "New York";  // Add new property
// delete user.age;         // Remove property
// console.log(user);
// let numbers = [1, 2, 3, 4];

// numbers.forEach(num => console.log(num * 2)); 
let numbers = [1, 2, 3, 4];

let squaredNumbers = numbers.map(num => num * num);
console.log(squaredNumbers); 
