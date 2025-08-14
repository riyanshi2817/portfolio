const recipesPerPage = 6;
let currentPage = 1;
let recipes = [];

fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
  .then(res => res.json())
  .then(data => {
    recipes = data.meals.map(meal => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      description: meal.strInstructions.substring(0, 80) + "..."
    }));
    displayRecipes();
    setupPagination();
  });

function displayRecipes() {
  const list = document.getElementById("recipe-list");
  list.innerHTML = "";

  let start = (currentPage - 1) * recipesPerPage;
  let end = start + recipesPerPage;
  let paginatedItems = recipes.slice(start, end);

  paginatedItems.forEach(recipe => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <a href="recipe.html?id=${recipe.id}">View Recipe</a>
    `;
    list.appendChild(card);
  });
}

function setupPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  let pageCount = Math.ceil(recipes.length / recipesPerPage);

  for (let i = 1; i <= pageCount; i++) {
    let btn = document.createElement("button");
    btn.innerText = i;
    btn.addEventListener("click", function() {
      currentPage = i;
      displayRecipes();
    });
    pagination.appendChild(btn);
  }
}
