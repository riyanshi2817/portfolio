const container = document.body.children[0];

const cont = document.getElementsByClassName("container"); 

console.log(cont);


//query selector

const cont = document.querySelector(".container");
console.log(cont);

let  box = document.getElementById("box")
console.log(box);

function handleclick()
{
    alert("the button is clicked");
}

// handleclick();

box.addEventListener("click",handleclick);


let parent = document.getElementsByClassName("parent")[0];
let child = document.getElementsByClassName("child")[0];

let grandfather = document.getElementsByClassName("grandfather")[0];

parent.addEventListener("click" , function(e)
{
    alert("parent is clicked");
    e.stopPropagation();

} ,true)

child.addEventListener("click" ,function(e)
{
    alert("child is clicked");
    e.stopPropagation();
} ,true)

grandfather.addEventListener("click" ,function(e)
{
    alert("grandfather is clicked");
    e.stopPropagation();
} ,true)

//event capture

//bubbel
parent.addEventListener("click" , function(e)
{
    alert("parent is clicked");
    e.stopPropagation();

} ,true)

child.addEventListener("click" ,function(e)
{
    alert("child is clicked");
    e.stopPropagation();
} ,true)

grandfather.addEventListener("click" ,function(e)
{
    alert("grandfather is clicked");
    e.stopPropagation();
} ,)