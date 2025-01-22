// Get elements from DOM
const searchButton = document.getElementById("search-btn");
const ingredientInput = document.getElementById("ingredient-input");
const recipeResults = document.getElementById("recipe-results");
const video = document.getElementById('background-video');
const videoContainer = document.getElementById('video-container');
const toggle = document.getElementById('toggle-video');
const toggleText = document.getElementById('toggle-text');



toggle.addEventListener('change', () => {
    if (toggle.checked) {
        video.pause(); // Pause the video
        videoContainer.style.backgroundColor = 'black'; // Set dark background
        video.style.display = 'none'; // Hide the video
        toggleText.textContent = 'Video OFF';
    } else {
        video.play(); // Play the video
        videoContainer.style.backgroundColor = 'transparent'; // Reset background
        video.style.display = 'block'; // Show the video
        toggleText.textContent = 'Video ON';
    }
});


// Hardcoded recipes
const recipes = {

};

// Event listener for the search button
searchButton.addEventListener('click', function() {
    const ingredients = ingredientInput.value.trim().toLowerCase();
    if (ingredients) {
        findRecipes(ingredients);
    } else {
        alert('Please enter some ingredients.');
    }
});

// Function to find recipes based on user input
function findRecipes(ingredients) {
    // Split the ingredients by comma and search for matching recipes
    const ingredientArray = ingredients.split(',').map(ingredient => ingredient.trim());
    let foundRecipes = [];

    ingredientArray.forEach(ingredient => {
        if (recipes[ingredient]) {
            foundRecipes = foundRecipes.concat(recipes[ingredient]);
        }
    });

    // Display results
    if (foundRecipes.length > 0) {
        displayRecipes(foundRecipes);
    } else {
        recipeResults.innerHTML = '<p>No recipes found for the given ingredients.</p>';
    }
}

// Function to display recipes
function displayRecipes(recipesList) {
    recipeResults.innerHTML = '';  // Clear previous results
    recipesList.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <p>${recipe.description}</p>
        `;
        recipeResults.appendChild(recipeCard);
    });
}

document.getElementById('recipe-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const ingredientInput = document.getElementById('ingredient-input').value;
    const responseDiv = document.getElementById('recipe-results');

    if (ingredientInput.trim() === '') {
        responseDiv.innerHTML = 'Please enter some ingredients.';
        return;
    }

    responseDiv.innerHTML = 'Generating recipe...';

    try {
        const response = await fetch('/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: ` ${ingredientInput}` })
        });

        const data = await response.json();
        responseDiv.innerHTML = `<pre>${data.response}</pre>`;
    } catch (error) {
        responseDiv.innerHTML = 'Error generating recipe. Please try again.';
    }
});
