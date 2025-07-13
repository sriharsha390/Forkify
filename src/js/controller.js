import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
function qs(params) {
  return document.querySelector(params);
}
const results = qs('.results');
async function getDishes(dish) {
  try {
    console.log('fetching Dishes');
    const res = await fetch(
      `https://forkify-api.jonas.io/api/v2/recipes/?search=${dish}`
      // `https://www.themealdb.com/api/json/v1/1/search.php?s=${dish}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
}
async function getRecipe(id) {
  try {
    console.log('fetching recipe');
    const res = await fetch(
      `https://forkify-api.jonas.io/api/v2/recipes/${id}`
      // `https://www.themealdb.com/api/json/v1/1/search.php?s=${dish}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
}
//// Showing results///
function renderSpinner(parentEl) {
  const spinner = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
  parentEl.innerHTML = ''; // Clear any existing content
  parentEl.insertAdjacentHTML('afterbegin', spinner);
}

const searchForm = qs('.search');
searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const dishName = qs('.search__field').value;
   renderSpinner(results);
  getDishes(dishName).then(data => {
    const { recipes } = data.data;

    // Clear results once before adding all recipes
    results.innerHTML = '';

    if (recipes.length === 0) {
      results.innerHTML = '<p>No recipes found</p>';
      return;
    }

    recipes.forEach(r => {
      const html = `
      <li class="preview">
            <a class="preview__link preview__link--active" href="#${r.id}">
              <figure class="preview__fig">
                <img src=${r.image_url} alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${r.title}</h4>
                <p class="preview__publisher">${r.publisher}</p>
                <div class="preview__user-generated">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>
      `;

      results.insertAdjacentHTML('beforeend', html);
      // history.pushState(null, '', `#${r.id}`);
    });
  });
});

function renderRecipe(id) {
  renderSpinner(recipeContainer);
  getRecipe(id).then(data => {
    let { recipe } = data.data;
    console.log(recipe);
    const html = `
    <figure class="recipe__fig">
          <img src="${recipe.image_url}" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cooking_time
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
${recipe.ingredients
  .map(el => {
    return `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${el.quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${el.unit}</span>
                ${el.description}
              </div>
            </li>`;
  })
  .join('')}
           
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.source_url}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
    qs('.recipe').innerHTML = '';
    qs('.recipe').insertAdjacentHTML('afterbegin', html);
  });
}
results.addEventListener('click', function (e) {
  const link = e.target.closest('.preview__link');
  if (!link) return;

  //e.preventDefault(); // prevent default anchor behavior
  // const recipeId = link.getAttribute('href').slice(1);
  // console.log('href=', recipeId);
  // if (!recipeId) return;

  // try {
  //   // Or render recipe here if you like
  //   // You can render like:
  //   renderRecipe(recipeId); // if you update renderRecipe to accept data
  // } catch (err) {
  //   console.error('Error loading recipe:', err);
  // }
});

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, function () {
    const id = window.location.hash.slice(1);
    if (!id) return;
    renderRecipe(id);
  })
);
