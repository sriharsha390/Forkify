const recipeContainer = document.querySelector('.recipe');
const timeout = function(s) {
    return new Promise(function(_, reject) {
        setTimeout(function() {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};
// https://forkify-api.herokuapp.com/v2
const Dummy = {
    data: {
        recipe: {
            cooking_time: 120,
            id: '664c8f193e7aa067e94e8297',
            image_url: 'http://forkify-api.herokuapp.com/images/100111309d9.jpg',
            ingredients: [
                {
                    description: 'white sugar',
                    quantity: 1.5,
                    unit: 'tsps'
                },
                {
                    description: 'warm water',
                    quantity: 1,
                    unit: 'cup'
                },
                {
                    description: 'active dry yeast',
                    quantity: 1.5,
                    unit: 'tsps'
                },
                {
                    description: 'olive oil',
                    quantity: 1,
                    unit: 'tbsp'
                },
                {
                    description: 'salt',
                    quantity: 0.5,
                    unit: 'tsp'
                },
                {
                    description: 'all-purpose flour',
                    quantity: 2,
                    unit: 'cups'
                },
                {
                    description: 'can crushed tomatoes',
                    quantity: 1,
                    unit: ''
                },
                {
                    description: 'packed brown sugar',
                    quantity: 1,
                    unit: 'tbsp'
                },
                {
                    description: 'garlic powder',
                    quantity: 0.5,
                    unit: 'tsp'
                },
                {
                    description: 'olive oil',
                    quantity: 1,
                    unit: 'tsp'
                },
                {
                    description: 'salt',
                    quantity: 0.5,
                    unit: 'tsp'
                },
                {
                    description: 'shredded mozzarella cheese divided',
                    quantity: 3,
                    unit: 'cups'
                },
                {
                    description: 'bulk italian sausage',
                    quantity: 0.5,
                    unit: 'pound'
                },
                {
                    description: 'package sliced pepperoni',
                    quantity: 1,
                    unit: ''
                },
                {
                    description: 'package sliced fresh mushrooms',
                    quantity: 1,
                    unit: ''
                },
                {
                    description: 'green bell pepper chopped',
                    quantity: 1,
                    unit: ''
                },
                {
                    description: 'red bell pepper chopped',
                    quantity: 1,
                    unit: ''
                }
            ],
            publisher: 'All Recipes',
            servings: 4,
            source_url: 'http://allrecipes.com/Recipe/Double-Crust-Stuffed-Pizza/Detail.aspx',
            title: 'Double Crust Stuffed Pizza'
        }
    },
    status: 'success'
};
///////////////////////////////////////
function qs(params) {
    return document.querySelector(params);
}
const results = qs('.results');
async function getDishes(dish) {
    try {
        console.log('fetching');
        const res = await fetch(`https://forkify-api.jonas.io/api/v2/recipes/?search=${dish}`);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch (err) {
        throw err;
    }
}
async function getRecipe(id) {
    try {
        console.log('fetching');
        const res = await fetch(`https://forkify-api.jonas.io/api/v2/recipes/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch (err) {
        throw err;
    }
}
//// Showing results///
const searchForm = qs('.search');
searchForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const dishName = qs('.search__field').value;
    getDishes(dishName).then((data)=>{
        console.log(data.data);
        const { recipes } = data.data;
        console.log(recipes);
        recipes.forEach((r)=>{
            const html = `
      <li class="preview">
            <a class="preview__link preview__link--active" href="${r.id}">
              <figure class="preview__fig">
                <img src=${r.image_url} alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${r.title}</h4>
                <p class="preview__publisher">${r.publisher}</p>
                <div class="preview__user-generated">
                  <svg>
                    <use href="src/img/icons.svg#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>
      `;
            results.insertAdjacentHTML('afterbegin', html);
        });
    });
});
function renderRecipe() {
    // getRecipe('664c8f193e7aa067e94e8297').then(data => {
    let { recipe } = Dummy.data;
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
              <use href="src/img/icons.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.cooking_time}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="src/img/icons.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="src/img/icons.svg#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="src/img/icons.svg#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="src/img/icons.svg#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="src/img/icons.svg#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
${recipe.ingredients.map((el)=>{
        return `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="src/img/icons.svg#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${el.quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${el.unit}</span>
                ${el.description}
              </div>
            </li>`;
    }).join('')}
           
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.source_url}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
    qs('.recipe').innerHTML = '';
    qs('.recipe').insertAdjacentHTML('afterbegin', html);
}
renderRecipe();

//# sourceMappingURL=Forkify.62406edb.js.map
