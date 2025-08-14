 const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
  .then(res => res.json())
  .then(data => {
    const meal = data.meals[0];
    displayRecipe(meal);
  });

function displayRecipe(meal) {
  const container = document.getElementById("recipe-details");
  container.innerHTML = `
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:300px">
    <p>${meal.strInstructions}</p>
    <h3>Ingredients:</h3>
    <ul>
      ${getIngredients(meal).map(ing => `<li>${ing}</li>`).join("")}
    </ul>
    <a href="index.html">⬅ Back to Recipes</a>
  `;
}

function getIngredients(meal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    let ingredient = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${ingredient} - ${measure}`);
    }
  }
  return ingredients;
}
