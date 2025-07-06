const easyJavaScriptQuestions = [
    {
        question: "What does 'NaN' stand for in JavaScript?",
        options: ["Not a Number", "Not a Null", "Number and Null", "Not available Number"],
        correct: "Not a Number",
        wrong: ["Not a Null", "Number and Null", "Not available Number"],
        difficulty: "Easy"
    },
    {
        question: "Which of the following is a JavaScript data type?",
        options: ["String", "Integer", "Character", "Float"],
        correct: "String",
        wrong: ["Integer", "Character", "Float"],
        difficulty: "Easy"
    },
    {
        question: "What keyword is used to declare a variable in JavaScript?",
        options: ["var", "let", "const", "All of the above"],
        correct: "All of the above",
        wrong: ["var", "let", "const"],
        difficulty: "Easy"
    },
    {
        question: "Which of the following methods is used to parse a JSON string in JavaScript?",
        options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.decode()"],
        correct: "JSON.parse()",
        wrong: ["JSON.stringify()", "JSON.convert()", "JSON.decode()"],
        difficulty: "Easy"
    },
    {
        question: "What does the 'typeof' operator do in JavaScript?",
        options: ["Determines the type of a variable", "Converts a variable to a string", "Checks if a variable is defined", "Returns the length of a string"],
        correct: "Determines the type of a variable",
        wrong: ["Converts a variable to a string", "Checks if a variable is defined", "Returns the length of a string"],
        difficulty: "Easy"
    },
    {
        question: "Which method is used to add an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correct: "push()",
        wrong: ["pop()", "shift()", "unshift()"],
        difficulty: "Easy"
    },
    {
        question: "How do you create a function in JavaScript?",
        options: ["function myFunction()", "function:myFunction()", "create myFunction()", "myFunction() = function"],
        correct: "function myFunction()",
        wrong: ["function:myFunction()", "create myFunction()", "myFunction() = function"],
        difficulty: "Easy"
    },
    {
        question: "What does 'this' refer to in JavaScript?",
        options: ["The global object", "The current object", "A function's parameter", "None of the above"],
        correct: "The current object",
        wrong: ["The global object", "A function's parameter", "None of the above"],
        difficulty: "Easy"
    },
    {
        question: "How do you write an array in JavaScript?",
        options: ["[]", "{}", "<>", "||"],
        correct: "[]",
        wrong: ["{}", "<>", "||"],
        difficulty: "Easy"
    },
    {
        question: "Which of the following is a truthy value in JavaScript?",
        options: ["0", "false", "null", "{}"],
        correct: "{}", // an empty object is truthy
        wrong: ["0", "false", "null"],
        difficulty: "Easy"
    },
    {
        question: "Which operator is used to compare both value and type in JavaScript?",
        options: ["==", "===", "=", "!="],
        correct: "===",
        wrong: ["==", "=", "!="],
        difficulty: "Easy"
    },
    {
        question: "What will the following code output: console.log(1 + '1')?",
        options: ["11", "2", "NaN", "undefined"],
        correct: "11",
        wrong: ["2", "NaN", "undefined"],
        difficulty: "Easy"
    },
    {
        question: "How do you define a constant in JavaScript?",
        options: ["let constantName = value;", "const constantName = value;", "var constantName = value;", "constant constantName = value;"],
        correct: "const constantName = value;",
        wrong: ["let constantName = value;", "var constantName = value;", "constant constantName = value;"],
        difficulty: "Easy"
    },
    {
        question: "What will be the output of the following code: console.log(typeof null)?",
        options: ["null", "object", "undefined", "number"],
        correct: "object",
        wrong: ["null", "undefined", "number"],
        difficulty: "Easy"
    },
    {
        question: "How do you convert a string to a number in JavaScript?",
        options: ["Number(string)", "parseInt(string)", "parseFloat(string)", "All of the above"],
        correct: "All of the above",
        wrong: ["Number(string)", "parseInt(string)", "parseFloat(string)"],
        difficulty: "Easy"
    },
    {
        question: "What will be the result of the following code: console.log(5 == '5')?",
        options: ["true", "false", "undefined", "NaN"],
        correct: "true",
        wrong: ["false", "undefined", "NaN"],
        difficulty: "Easy"
    },
    {
        question: "What method would you use to remove the last element from an array?",
        options: ["pop()", "shift()", "push()", "slice()"],
        correct: "pop()",
        wrong: ["shift()", "push()", "slice()"],
        difficulty: "Easy"
    },
    {
        question: "How can you add a comment in JavaScript?",
        options: ["// This is a comment", "<!-- This is a comment -->", "# This is a comment", "' This is a comment"],
        correct: "// This is a comment",
        wrong: ["<!-- This is a comment -->", "# This is a comment", "' This is a comment"],
        difficulty: "Easy"
    },
    {
        question: "Which built-in method combines the text of two strings and returns a new string?",
        options: ["append()", "concat()", "join()", "combine()"],
        correct: "concat()",
        wrong: ["append()", "join()", "combine()"],
        difficulty: "Easy"
    },
    {
        question: "Which of the following is used to define an object in JavaScript?",
        options: ["{}", "[]", "()", "<>"],
        correct: "{}",
        wrong: ["[]", "()", "<>"],
        difficulty: "Easy"
    },
    {
        question: "Which method is used to find the index of an element in an array?",
        options: ["indexOf()", "findIndex()", "search()", "getIndex()"],
        correct: "indexOf()",
        wrong: ["findIndex()", "search()", "getIndex()"],
        difficulty: "Easy"
    },
    {
        question: "What is the purpose of the 'return' statement in a function?",
        options: ["To stop the function", "To pass data back to the caller", "To define a function", "None of the above"],
        correct: "To pass data back to the caller",
        wrong: ["To stop the function", "To define a function", "None of the above"],
        difficulty: "Easy"
    },
    {
        question: "How do you call a function named 'myFunction'?",
        options: ["call myFunction()", "myFunction()", "invoke myFunction()", "execute myFunction()"],
        correct: "myFunction()",
        wrong: ["call myFunction()", "invoke myFunction()", "execute myFunction()"],
        difficulty: "Easy"
    },
    {
        question: "What will the following code output: console.log(false + 1)?",
        options: ["1", "false", "NaN", "undefined"],
        correct: "1",
        wrong: ["false", "NaN", "undefined"],
        difficulty: "Easy"
    },
    {
        question: "Which of the following is not a primitive data type in JavaScript?",
        options: ["String", "Number", "Boolean", "Object"],
        correct: "Object",
        wrong: ["String", "Number", "Boolean"],
        difficulty: "Easy"
    },
    {
        question: "Which function is used to parse a string to an integer in JavaScript?",
        options: ["parseInt()", "parseFloat()", "toInteger()", "Number()"],
        correct: "parseInt()",
        wrong: ["parseFloat()", "toInteger()", "Number()"],
        difficulty: "Easy"
    },
    {
        question: "What will be the output of the following code: console.log(2 + '2')?",
        options: ["22", "4", "NaN", "undefined"],
        correct: "22",
        wrong: ["4", "NaN", "undefined"],
        difficulty: "Easy"
    },
    {
        question: "Which keyword is used to create a new object in JavaScript?",
        options: ["new", "create", "object", "define"],
        correct: "new",
        wrong: ["create", "object", "define"],
        difficulty: "Easy"
    },
    {
        question: "How can you check if a variable is an array?",
        options: ["Array.isArray()", "instanceof Array", "typeof variable === 'array'", "Both A and B"],
        correct: "Both A and B",
        wrong: ["Array.isArray()", "typeof variable === 'array'"],
        difficulty: "Easy"
    },
    {
        question: "What does the 'let' keyword do in JavaScript?",
        options: ["Declares a variable that can be reassigned", "Declares a constant variable", "Declares a variable with global scope", "Declares a variable that cannot be reassigned"],
        correct: "Declares a variable that can be reassigned",
        wrong: ["Declares a constant variable", "Declares a variable with global scope", "Declares a variable that cannot be reassigned"],
        difficulty: "Easy"
    }
];

const mediumJavaScriptQuestions = [
    {
        question: "What is the output of 'console.log(typeof NaN);'?",
        options: ["number", "undefined", "object", "NaN"],
        correct: "number",
        wrong: ["undefined", "object", "NaN"],
        difficulty: "Medium"
    },
    {
        question: "What will be the result of 'console.log(0.1 + 0.2 === 0.3);'?",
        options: ["true", "false", "undefined", "NaN"],
        correct: "false",
        wrong: ["true", "undefined", "NaN"],
        difficulty: "Medium"
    },
    {
        question: "What is the purpose of the 'bind' method in JavaScript?",
        options: ["To create a new function with a specific 'this' value", "To merge two functions", "To call a function immediately", "To define a function"],
        correct: "To create a new function with a specific 'this' value",
        wrong: ["To merge two functions", "To call a function immediately", "To define a function"],
        difficulty: "Medium"
    },
    {
        question: "Which of the following methods can be used to add an element to the beginning of an array?",
        options: ["push()", "unshift()", "concat()", "slice()"],
        correct: "unshift()",
        wrong: ["push()", "concat()", "slice()"],
        difficulty: "Medium"
    },
    {
        question: "What does the 'spread' operator do in JavaScript?",
        options: ["Merges arrays", "Copies an array", "Expands an array into elements", "None of the above"],
        correct: "Expands an array into elements",
        wrong: ["Merges arrays", "Copies an array", "None of the above"],
        difficulty: "Medium"
    },
    {
        question: "What is a closure in JavaScript?",
        options: ["A function that has access to its own scope, the outer function's scope, and the global scope", "A way to create private variables", "An error in the code", "A special kind of function"],
        correct: "A function that has access to its own scope, the outer function's scope, and the global scope",
        wrong: ["A way to create private variables", "An error in the code", "A special kind of function"],
        difficulty: "Medium"
    },
    {
        question: "What is the purpose of the 'setTimeout' function?",
        options: ["To delay execution of a function", "To create a loop", "To call a function immediately", "To pause code execution"],
        correct: "To delay execution of a function",
        wrong: ["To create a loop", "To call a function immediately", "To pause code execution"],
        difficulty: "Medium"
    },
    {
        question: "What does 'JSON.stringify()' do?",
        options: ["Parses a JSON string into a JavaScript object", "Converts a JavaScript object into a JSON string", "Validates a JSON string", "None of the above"],
        correct: "Converts a JavaScript object into a JSON string",
        wrong: ["Parses a JSON string into a JavaScript object", "Validates a JSON string", "None of the above"],
        difficulty: "Medium"
    },
    {
        question: "How can you prevent a form from submitting in JavaScript?",
        options: ["event.preventDefault()", "return false", "Both A and B", "None of the above"],
        correct: "Both A and B",
        wrong: ["event.preventDefault()", "return false", "None of the above"],
        difficulty: "Medium"
    },
    {
        question: "What is the output of 'console.log(2 + '2' - 1);'?",
        options: ["21", "1", "undefined", "NaN"],
        correct: "21",
        wrong: ["1", "undefined", "NaN"],
        difficulty: "Medium"
    },
    {
        question: "What is a promise in JavaScript?",
        options: ["An object that represents the eventual completion or failure of an asynchronous operation", "A function that runs in the background", "A synchronous operation", "None of the above"],
        correct: "An object that represents the eventual completion or failure of an asynchronous operation",
        wrong: ["A function that runs in the background", "A synchronous operation", "None of the above"],
        difficulty: "Medium"
    },
    {
        question: "How do you create an object in JavaScript?",
        options: ["var obj = {}", "var obj = new Object()", "Both A and B", "None of the above"],
        correct: "Both A and B",
        wrong: ["var obj = {}", "var obj = new Object()", "None of the above"],
        difficulty: "Medium"
    },
    {
        question: "What is the output of 'console.log([1, 2] == [1, 2]);'?",
        options: ["true", "false", "undefined", "ReferenceError"],
        correct: "false",
        wrong: ["true", "undefined", "ReferenceError"],
        difficulty: "Medium"
    },
    {
        question: "What will be the output of 'console.log(typeof null);'?",
        options: ["null", "object", "undefined", "number"],
        correct: "object",
        wrong: ["null", "undefined", "number"],
        difficulty: "Medium"
    },
    {
        question: "Which operator is used for strict equality comparison?",
        options: ["==", "===", "=", "!="],
        correct: "===",
        wrong: ["==", "=", "!="],
        difficulty: "Medium"
    },
    {
        question: "What is the purpose of 'Array.prototype.map'?",
        options: ["To create a new array with the results of calling a function on every element", "To filter an array", "To sort an array", "To iterate over an array"],
        correct: "To create a new array with the results of calling a function on every element",
        wrong: ["To filter an array", "To sort an array", "To iterate over an array"],
        difficulty: "Medium"
    },
    {
        question: "What is the result of 'console.log(1 + '2' + 3);'?",
        options: ["123", "6", "33", "NaN"],
        correct: "123",
        wrong: ["6", "33", "NaN"],
        difficulty: "Medium"
    },
    {
        question: "What does 'localStorage' do?",
        options: ["Stores data in the browser", "Stores data on the server", "Stores data temporarily", "None of the above"],
        correct: "Stores data in the browser",
        wrong: ["Stores data on the server", "Stores data temporarily", "None of the above"],
        difficulty: "Medium"
    },
    {
        question: "How can you check if an object is empty in JavaScript?",
        options: ["Object.keys(obj).length === 0", "obj.length === 0", "Object.isEmpty(obj)", "None of the above"],
        correct: "Object.keys(obj).length === 0",
        wrong: ["obj.length === 0", "Object.isEmpty(obj)", "None of the above"],
        difficulty: "Medium"
    },
    {
        question: "What does the 'filter()' method do in an array?",
        options: ["Creates a new array with all elements that pass the test implemented by the provided function", "Creates a new array with elements that do not pass the test", "Merges two arrays", "Sorts an array"],
        correct: "Creates a new array with all elements that pass the test implemented by the provided function",
        wrong: ["Creates a new array with elements that do not pass the test", "Merges two arrays", "Sorts an array"],
        difficulty: "Medium"
    },
    {
        question: "What will be the output of 'console.log([1] == true);'?",
        options: ["true", "false", "undefined", "NaN"],
        correct: "true",
        wrong: ["false", "undefined", "NaN"],
        difficulty: "Medium"
    },
    {
        question: "What will be the result of 'console.log(5 in [1, 2, 3, 4, 5]);'?",
        options: ["true", "false", "undefined", "ReferenceError"],
        correct: "false",
        wrong: ["true", "undefined", "ReferenceError"],
        difficulty: "Medium"
    },
    {
        question: "What is a 'callback' function?",
        options: ["A function that is passed as an argument to another function", "A function that calls itself", "A function that returns another function", "None of the above"],
        correct: "A function that is passed as an argument to another function",
        wrong: ["A function that calls itself", "A function that returns another function", "None of the above"],
        difficulty: "Medium"
    },
    {
        question: "Which method is used to convert a JSON string into a JavaScript object?",
        options: ["JSON.parse()", "JSON.stringify()", "JSON.toObject()", "JSON.convert()"],
        correct: "JSON.parse()",
        wrong: ["JSON.stringify()", "JSON.toObject()", "JSON.convert()"],
        difficulty: "Medium"
    },
    {
        question: "How do you handle exceptions in JavaScript?",
        options: ["try...catch", "throw", "error", "Both A and B"],
        correct: "Both A and B",
        wrong: ["try...catch", "throw", "error"],
        difficulty: "Medium"
    },
    {
        question: "What is the output of 'console.log(!!null);'?",
        options: ["true", "false", "undefined", "NaN"],
        correct: "false",
        wrong: ["true", "undefined", "NaN"],
        difficulty: "Medium"
    },
    {
        question: "What does the 'slice()' method do?",
        options: ["Adds elements to an array", "Extracts a section of an array", "Removes the last element from an array", "None of the above"],
        correct: "Extracts a section of an array",
        wrong: ["Adds elements to an array", "Removes the last element from an array", "None of the above"],
        difficulty: "Medium"
    },
    {
        question: "What is the purpose of the 'async' keyword in JavaScript?",
        options: ["To define an asynchronous function", "To pause the execution of a function", "To create a promise", "To handle errors"],
        correct: "To define an asynchronous function",
        wrong: ["To pause the execution of a function", "To create a promise", "To handle errors"],
        difficulty: "Medium"
    },
    {
        question: "Which of the following will NOT throw an error?",
        options: ["console.log(undefinedVariable);", "null.f();", "console.log('string');", "throw new Error();"],
        correct: "console.log('string');",
        wrong: ["console.log(undefinedVariable);", "null.f();", "throw new Error();"],
        difficulty: "Medium"
    },
    {
        question: "What will 'console.log(typeof []);' output?",
        options: ["array", "object", "undefined", "null"],
        correct: "object",
        wrong: ["array", "undefined", "null"],
        difficulty: "Medium"
    }
];


const hardJavaScriptQuestions = [
    {
        question: "What is the output of 'console.log(0.1 + 0.2 === 0.3);'?",
        options: ["true", "false", "undefined", "NaN"],
        correct: "false",
        wrong: ["true", "undefined", "NaN"],
        difficulty: "Hard"
    },
    {
        question: "What will 'console.log(typeof null);' return?",
        options: ["null", "object", "undefined", "number"],
        correct: "object",
        wrong: ["null", "undefined", "number"],
        difficulty: "Hard"
    },
    {
        question: "What is a closure?",
        options: ["A function that retains access to its lexical scope", "A method of storing data", "A type of object", "A JavaScript error"],
        correct: "A function that retains access to its lexical scope",
        wrong: ["A method of storing data", "A type of object", "A JavaScript error"],
        difficulty: "Hard"
    },
    {
        question: "What will be the result of 'console.log(1 + '1' == 2);'?",
        options: ["true", "false", "undefined", "NaN"],
        correct: "false",
        wrong: ["true", "undefined", "NaN"],
        difficulty: "Hard"
    },
    {
        question: "What is the difference between 'let' and 'var'?",
        options: ["let has block scope, var has function scope", "let is hoisted, var is not", "var can be redeclared, let cannot", "None of the above"],
        correct: "let has block scope, var has function scope",
        wrong: ["let is hoisted, var is not", "var can be redeclared, let cannot", "None of the above"],
        difficulty: "Hard"
    },
    {
        question: "How can you create a singleton in JavaScript?",
        options: ["Using an IIFE", "Using a class", "Using a closure", "All of the above"],
        correct: "All of the above",
        wrong: ["Using an IIFE", "Using a class", "Using a closure"],
        difficulty: "Hard"
    },
    {
        question: "What is the purpose of 'Promise.all()'?",
        options: ["To execute multiple promises in parallel", "To combine results of multiple promises", "To handle errors in promises", "None of the above"],
        correct: "To execute multiple promises in parallel",
        wrong: ["To combine results of multiple promises", "To handle errors in promises", "None of the above"],
        difficulty: "Hard"
    },
    {
        question: "What does 'bind()' do in JavaScript?",
        options: ["Creates a new function that, when called, has its 'this' keyword set to the provided value", "Changes the context of a function", "Returns a new object", "None of the above"],
        correct: "Creates a new function that, when called, has its 'this' keyword set to the provided value",
        wrong: ["Changes the context of a function", "Returns a new object", "None of the above"],
        difficulty: "Hard"
    },
    {
        question: "What is the output of 'console.log([1] == true);'?",
        options: ["true", "false", "undefined", "NaN"],
        correct: "true",
        wrong: ["false", "undefined", "NaN"],
        difficulty: "Hard"
    },
    {
        question: "What will be the output of 'console.log(typeof (function(){}));'?",
        options: ["function", "object", "undefined", "null"],
        correct: "function",
        wrong: ["object", "undefined", "null"],
        difficulty: "Hard"
    },
    {
        question: "What is event delegation in JavaScript?",
        options: ["Attaching a single event listener to a parent element", "Listening for events on multiple elements", "Using promises", "Handling asynchronous operations"],
        correct: "Attaching a single event listener to a parent element",
        wrong: ["Listening for events on multiple elements", "Using promises", "Handling asynchronous operations"],
        difficulty: "Hard"
    },
    {
        question: "How does 'this' work in JavaScript?",
        options: ["It refers to the global object in the global context", "It refers to the object that is executing the current function", "It refers to the object that calls the current function", "All of the above"],
        correct: "All of the above",
        wrong: ["It refers to the global object in the global context", "It refers to the object that is executing the current function", "It refers to the object that calls the current function"],
        difficulty: "Hard"
    },
    {
        question: "What is the purpose of 'Object.create()'?",
        options: ["To create a new object with the specified prototype", "To copy properties from one object to another", "To merge two objects", "None of the above"],
        correct: "To create a new object with the specified prototype",
        wrong: ["To copy properties from one object to another", "To merge two objects", "None of the above"],
        difficulty: "Hard"
    },
    {
        question: "What will be the output of 'console.log(0 == false);'?",
        options: ["true", "false", "undefined", "NaN"],
        correct: "true",
        wrong: ["false", "undefined", "NaN"],
        difficulty: "Hard"
    },
    {
        question: "What does the 'spread' operator do?",
        options: ["Expands an array into elements", "Merges two arrays", "Clones an array", "None of the above"],
        correct: "Expands an array into elements",
        wrong: ["Merges two arrays", "Clones an array", "None of the above"],
        difficulty: "Hard"
    },
    {
        question: "What is 'hoisting' in JavaScript?",
        options: ["Moving declarations to the top of their containing scope", "A way to create variables", "A way to call functions", "None of the above"],
        correct: "Moving declarations to the top of their containing scope",
        wrong: ["A way to create variables", "A way to call functions", "None of the above"],
        difficulty: "Hard"
    },
    {
        question: "What will be the output of 'console.log(1 + '1' - 1);'?",
        options: ["11", "1", "0", "NaN"],
        correct: "1",
        wrong: ["11", "0", "NaN"],
        difficulty: "Hard"
    },
    {
        question: "What is 'async/await' in JavaScript?",
        options: ["A way to handle asynchronous operations", "A method for error handling", "A type of promise", "None of the above"],
        correct: "A way to handle asynchronous operations",
        wrong: ["A method for error handling", "A type of promise", "None of the above"],
        difficulty: "Hard"
    },
    {
        question: "What is the difference between '==' and '===' in JavaScript?",
        options: ["'==' checks value, '===' checks value and type", "'==' checks type, '===' checks value", "No difference", "'==' is used for numbers only"],
        correct: "'==' checks value, '===' checks value and type",
        wrong: ["'==' checks type, '===' checks value", "No difference", "'==' is used for numbers only"],
        difficulty: "Hard"
    },
    {
        question: "What does 'Array.prototype.reduce()' do?",
        options: ["Executes a reducer function on each element", "Creates a new array", "Filters an array", "Merges two arrays"],
        correct: "Executes a reducer function on each element",
        wrong: ["Creates a new array", "Filters an array", "Merges two arrays"],
        difficulty: "Hard"
    },
    {
        question: "What will be the output of 'console.log(typeof [] === 'object');'?",
        options: ["true", "false", "undefined", "NaN"],
        correct: "true",
        wrong: ["false", "undefined", "NaN"],
        difficulty: "Hard"
    },
    {
        question: "What is the result of 'console.log(1 + '1' + 1);'?",
        options: ["111", "3", "2", "NaN"],
        correct: "111",
        wrong: ["3", "2", "NaN"],
        difficulty: "Hard"
    },
    {
        question: "What does the 'filter()' method do in an array?",
        options: ["Creates a new array with elements that pass the test", "Removes elements from an array", "Merges two arrays", "Sorts an array"],
        correct: "Creates a new array with elements that pass the test",
        wrong: ["Removes elements from an array", "Merges two arrays", "Sorts an array"],
        difficulty: "Hard"
    },
    {
        question: "What will 'console.log([1, 2] + [3, 4]);' return?",
        options: ["[1, 2, 3, 4]", "undefined", "NaN", "6"],
        correct: "1,23,4",
        wrong: ["[1, 2, 3, 4]", "undefined", "NaN"],
        difficulty: "Hard"
    },
    {
        question: "What is the output of 'console.log(1 / 0);'?",
        options: ["Infinity", "0", "undefined", "NaN"],
        correct: "Infinity",
        wrong: ["0", "undefined", "NaN"],
        difficulty: "Hard"
    },
    {
        question: "What does the 'setTimeout' function return?",
        options: ["A timer ID", "A promise", "A reference to the function", "undefined"],
        correct: "A timer ID",
        wrong: ["A promise", "A reference to the function", "undefined"],
        difficulty: "Hard"
    },
    {
        question: "What is 'this' in an arrow function?",
        options: ["The global object", "The enclosing lexical context", "Undefined", "It depends on how the function is called"],
        correct: "The enclosing lexical context",
        wrong: ["The global object", "Undefined", "It depends on how the function is called"],
        difficulty: "Hard"
    },
    {
        question: "What is the purpose of the 'prototype' property in JavaScript?",
        options: ["To define properties and methods for objects", "To create a new object", "To copy properties from one object to another", "None of the above"],
        correct: "To define properties and methods for objects",
        wrong: ["To create a new object", "To copy properties from one object to another", "None of the above"],
        difficulty: "Hard"
    },
    {
        question: "What does the 'slice()' method do on an array?",
        options: ["Returns a new array with selected elements", "Removes elements from an array", "Merges two arrays", "None of the above"],
        correct: "Returns a new array with selected elements",
        wrong: ["Removes elements from an array", "Merges two arrays", "None of the above"],
        difficulty: "Hard"
    },
    {
        question: "What is the output of 'console.log({} + []);'?",
        options: ["[object Object]", "undefined", "NaN", "[]"],
        correct: "[object Object]",
        wrong: ["undefined", "NaN", "[]"],
        difficulty: "Hard"
    }
];

const startbtn = document.getElementById('startbtn');
let no_of_question = document.getElementById('no-of-question');
let difficulty = document.getElementById('difficulty');
const selectbtn = document.getElementById('select');

let time_left = document.getElementById('time-left');
let time_line = document.getElementById('time-line');

let question = document.getElementById('question');
const optionButtons = Array.from(document.querySelectorAll('.ans-btn button'));

// const ans_btn1 = document.getElementById('btn1');
// const ans_btn2 = document.getElementById('btn2');
// const ans_btn3 = document.getElementById('btn3');
// const ans_btn4 = document.getElementById('btn4');

let qinfo = document.getElementById('qinfo');
const nextbtn = document.getElementById('nextbtn');

const startPage = document.querySelector('.startpage');
const selectPage = document.querySelector('.selectpage');
const questionContainer = document.querySelector('.question-container');

let currentQuestionIndex = 0;
let selectedQuestions = [];

startbtn.addEventListener("click", () => {
    startPage.style.display = "none";
    selectPage.style.display = "block";
});

selectbtn.addEventListener("click", () => {
    selectPage.style.display = "none";
    questionContainer.style.display = "block";

    let numberOfQuestions = parseInt(no_of_question.value);
    let selectedDifficulty = difficulty.value;

    let combinedQuestions = [];

    if (selectedDifficulty === "easy") {
        combinedQuestions = [...easyJavaScriptQuestions];
    } else if (selectedDifficulty === "medium") {
        combinedQuestions = [...mediumJavaScriptQuestions];
    } else if (selectedDifficulty === "hard") {
        combinedQuestions = [...hardJavaScriptQuestions];
    } else if (selectedDifficulty === "mix") {
        combinedQuestions = [
            ...easyJavaScriptQuestions,
            ...mediumJavaScriptQuestions,
            ...hardJavaScriptQuestions
        ];
    }

    combinedQuestions.sort(() => Math.random() - 0.5);

    selectedQuestions = combinedQuestions.slice(0, numberOfQuestions);

    currentQuestionIndex = 0;
    currentQuestion = selectedQuestions[currentQuestionIndex];
    showQuestion();
    startTimer();
});

let timerInterval;
let timeLimit = 15;
let timePassed = 0;

function startTimer() {
    timePassed = 0;
    time_left.textContent = timeLimit;

    timerInterval = setInterval(() => {
        timePassed++;
        let timeRemaining = timeLimit - timePassed;

        time_left.textContent = timeRemaining;

        time_line.style.width = `${(timePassed / timeLimit) * 100}%`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            time_left.textContent = "times's up!";
        }
    }, 1000);
}

function showQuestion() {
    let currentQuestion = selectedQuestions[currentQuestionIndex];

    question.textContent = currentQuestion.question;

    optionButtons.forEach((btn, index) => {
        btn.textContent = currentQuestion.options[index];
        btn.disabled = false;
        btn.style.backgroundColor = "";
    });

    qinfo.textContent = `Question ${currentQuestionIndex + 1} of ${selectedQuestions.length}`;
}
