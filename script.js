const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const meals = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMeal = document.getElementById('single-meal');
const spinner = document.getElementById('spinner');



// Search meal and fetch from API
async function searchMeal(e) {
    e.preventDefault();

    // Shows a spinner before displaying meals
    showSpinner();

    // Clear single meal
    if (!meals.innerHTML == '' || !search.value == '') {
        singleMeal.innerHTML = '';
    }
    // Get search term
    const term = search.value;

    // Check for empty
    if (term.trim()) {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await res.json();
        resultHeading.innerHTML = `<h3>Search results for '${term}':</h3>`;

        if (data.meals === null) {
            resultHeading.innerHTML = `<p>Search not found</p>`;
        } else {
            meals.innerHTML = data.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h4>${meal.strMeal}</h4>
                        </div>
                    </div>
                    `)
                .join('');
        }
        ;
        // Clear Search Input
        search.value = '';

    } else {
        if (!resultHeading.innerHTML == '') {
            const resultHeadingSave = resultHeading.innerHTML;
            resultHeading.innerHTML =
                "<p>Please don't leave the search box empty</p>";
            setTimeout(() => {
                resultHeading.innerHTML = resultHeadingSave;
            }, 2000);
        } else {
            resultHeading.innerHTML =
                "<p>Please don't leave the search box empty</p>";
            setTimeout(() => {
                resultHeading.innerHTML = '';
            }, 2000);
        }
    }

}


// Fetching meal by ID 
async function getMealById(mealID) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await res.json();
    const meal = data.meals[0];
    displayMealToUI(meal);
    scrollUp();
}

// Fetch a random meal
function getRandomMeal() {
    //Clear meals heading
    meals.innerHTML = '';
    resultHeading.innerHTML = '';
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            displayMealToUI(meal);
        })
}

// Add meal to DOM
function displayMealToUI(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strMeasure${i}`]}  ${meal[`strIngredient${i}`]}`);
        } else {
            break;
        }
    }

    singleMeal.innerHTML = `
    <div class="single-meal">
        <h2>${meal.strMeal}  <i class="fas fa-utensil-spoon"></i></h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="single-meal-info">
            ${meal.strArea ? `<p>Nationality: ${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
        <h4>Ingredients</h4>
        <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        <h4>Intructions</h4>
        ${meal.strInstructions.split(';').map(item => `<p>${item}</p>`).join('').replace(/\s+/g, ' ')}
        </div>
    </div>
    `
}

// See meal details right after clicking on meal
function scrollUp() {
    window.scrollTo(0, 180);
}


function showSpinner() {
    spinner.classList.remove('hidden');
    resultHeading.classList.add('hidden');
    setTimeout(() => {
        meals.classList.remove('hidden');
        spinner.classList.add('hidden');
        resultHeading.classList.remove('hidden');
    }, 700)
    meals.classList.add('hidden');
}





// Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

meals.addEventListener('click', e => {
    const mealID = e.target.closest('.meal-info') ? e.target.closest('.meal-info').dataset.mealid : false;
    if (mealID) {
        getMealById(mealID);

    } else {
        return false;
    }
});

