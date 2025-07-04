// let  container = document.getElementsByClassName("container")[0];
// let  box = document.getElementsByClassName("box")[0];
// let  innerbox = document.getElementsByClassName("innerbox")[0];


// container.addEventListener("click" ,function(e)
// {
//     alert("container is clicked");
// })

// box.addEventListener("click" ,function(e)
// {
//     alert("box is clicked");
// })
// box.addEventListener("click",)
// innerbox.addEventListener("click" ,function(e)
// {
//     alert("innerbox is clicked");
// })

document.addEventListener("click", function (e) {
  e.preventDefault(); // prevent default actions like link clicks

  // Remove previous highlight
  const previouslyHighlighted = document.querySelector(".highlighted");
  if (previouslyHighlighted) {
    previouslyHighlighted.classList.remove("highlighted");
  }

  // Add highlight to clicked element
  e.target.classList.add("highlighted");
});
