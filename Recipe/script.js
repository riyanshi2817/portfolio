let allRecipes = [];
let filteredRecipes = [];
let currentPage = 1;
const recipesPerPage = 3; // show 3 recipes per page (you can change)

const recipesContainer = document.getElementById("recipes");
const searchBox = document.getElementById("searchBox");
const pageInfo = document.getElementById("pageInfo");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Fetch recipes from API
async function fetchRecipes() {
    try {
        const res = await fetch("https://dummyjson.com/recipes?limit=30&limit=100");
        const data = await res.json();
        allRecipes = data.recipes;
        filteredRecipes = allRecipes;
        displayRecipes();
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

// Display recipes according to page
function displayRecipes() {
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const recipesToShow = filteredRecipes.slice(startIndex, endIndex);

    recipesContainer.innerHTML = "";

    if (recipesToShow.length === 0) {
        recipesContainer.innerHTML = "<p>No recipes found.</p>";
        pageInfo.textContent = "";
        return;
    }

    recipesToShow.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe");
        recipeCard.innerHTML = `
            <h2>${recipe.name}</h2>
            <img src="${recipe.image}" alt="${recipe.name}">
            <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
            <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
            <p><strong>Prep Time:</strong> ${recipe.prepTimeMinutes} mins</p>
        `;
        recipesContainer.appendChild(recipeCard);
    });

    // Update page info
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredRecipes.length / recipesPerPage)}`;

    // Disable prev/next if needed
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === Math.ceil(filteredRecipes.length / recipesPerPage);
}

// Search recipes
searchBox.addEventListener("input", () => {
    const query = searchBox.value.toLowerCase();
    filteredRecipes = allRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query)
    );
    currentPage = 1; // reset to first page after search
    displayRecipes();
});

// Pagination buttons
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayRecipes();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentPage < Math.ceil(filteredRecipes.length / recipesPerPage)) {
        currentPage++;
        displayRecipes();
    }
});

// Initial fetch
fetchRecipes();
