// Get elements from DOM
const searchButton = document.getElementById("search-btn");
const ingredientInput = document.getElementById("ingredient-input");
const recipeResults = document.getElementById("recipe-results");
const video = document.getElementById('background-video');

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
    recipeResults.innerHTML = 'Generating recipe...';

    fetch('/ai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: `recipe for ${ingredients}` })
    })
    .then(response => response.json())
    .then(data => {
        const formattedResponse = data.response
            .replace(/\*/g, '') // Remove stars
            .replace(/(.{60})/g, '$1\n') // Add line breaks at 60 characters
            .replace(/(Ingredients:|Instructions:|Tips for Success:|Variations:)/g, '<h2 style="color: #FBBB04;">$1</h2>') // Color headings and make them larger
            .replace(/\n/g, '<br>'); // Replace newlines with <br> for HTML formatting

        recipeResults.innerHTML = `<div style="padding: 20px; background-color: #1e1e1e; border-radius: 10px;">${formattedResponse}</div>`; // Use a div to style the response
        recipeResults.style.maxHeight = 'none'; // Adjust container size according to the response
    })
    .catch(error => {
        recipeResults.innerHTML = 'Error generating recipe. Please try again.';
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
        const response = await fetch('/ai', { // Use relative URL for Vercel deployment
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: `recipe for ${ingredientInput}` })
        });

        const data = await response.json();
        const formattedResponse = data.response
            .replace(/\*/g, '') // Remove stars
            .replace(/(.{60})/g, '$1\n') // Add line breaks at 60 characters
            .replace(/(Ingredients:|Instructions:|Tips for Success:|Variations:)/g, '<h2 style="color: #FBBB04;">$1</h2>') // Color headings and make them larger
            .replace(/\n/g, '<br>'); // Replace newlines with <br> for HTML formatting

        responseDiv.innerHTML = `<div style="padding: 20px; background-color: #1e1e1e; border-radius: 10px;">${formattedResponse}</div>`; // Use a div to style the response
        responseDiv.style.maxHeight = 'none'; // Adjust container size according to the response
    } catch (error) {
        responseDiv.innerHTML = 'Error generating recipe. Please try again.';
    }
});
