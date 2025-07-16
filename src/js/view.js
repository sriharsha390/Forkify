import icons from 'url:../img/icons.svg';

// DOM Elements
const recipeContainer = document.querySelector('.recipe');
const results = document.querySelector('.results');

// Helper function to format ingredient quantities
function formatQuantity(quantity) {
  if (!quantity) return '';
  
  // Round to 2 decimal places and remove trailing zeros
  const rounded = Math.round(quantity * 100) / 100;
  
  // Convert to fraction for common values
  if (rounded === 0.5) return '1/2';
  if (rounded === 0.33 || rounded === 0.333) return '1/3';
  if (rounded === 0.25) return '1/4';
  if (rounded === 0.75) return '3/4';
  if (rounded === 0.67 || rounded === 0.667) return '2/3';
  
  // Return as decimal if it has decimal places, otherwise as integer
  return rounded % 1 === 0 ? rounded.toString() : rounded.toString();
}

// Utility function for DOM selection
function qs(selector) {
  return document.querySelector(selector);
}

// Render spinner
function renderSpinner(parentEl) {
  const spinner = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', spinner);
}

// Render search results
function renderSearchResults(recipes) {
  results.innerHTML = '';

  if (recipes.length === 0) {
    results.innerHTML = '<p>No recipes found</p>';
    return;
  }

  recipes.forEach(recipe => {
    const html = `
      <li class="preview">
        <a class="preview__link preview__link--active" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src=${recipe.image_url} alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
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
  });
}

// Render recipe details
function renderRecipe(recipe) {
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
          <button class="btn--tiny btn--decrease-servings">
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
              <div class="recipe__quantity">${formatQuantity(el.quantity)}</div>
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
  
  recipeContainer.innerHTML = '';
  recipeContainer.insertAdjacentHTML('afterbegin', html);
}

// Get search query from input
function getSearchQuery() {
  return qs('.search__field').value;
}

// Clear search input
function clearSearchInput() {
  qs('.search__field').value = '';
}

// Render pagination buttons
function renderPagination(currentPage, numPages) {
  const pagination = document.querySelector('.pagination');
  
  console.log('Rendering pagination for page:', currentPage, 'of', numPages);
  
  // Don't render pagination if there's only 1 page or no results
  if (numPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  const html = `${currentPage > 1 ? `<button class="btn--inline pagination__btn--prev" data-goto="${currentPage - 1}">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
      </button>` : ''}<span class="pagination__info">Page ${currentPage} of ${numPages}</span>${currentPage < numPages ? `<button class="btn--inline pagination__btn--next" data-goto="${currentPage + 1}">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>` : ''}`;

  pagination.innerHTML = html;
}

function displayBookmarkmsg(msg) {
  // Create a temporary message that appears and disappears
  const message = document.createElement('div');
  message.className = 'bookmark-notification';
  message.innerHTML = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${msg}</p>
    </div>
  `;
  
  // Add the message to the body
  document.body.appendChild(message);
  
  // Remove the message after 3 seconds
  setTimeout(() => {
    message.classList.add('slide-out');
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 300);
  }, 3000);
}

export {
  qs,
  renderSpinner,
  renderSearchResults,
  renderRecipe,
  renderPagination,
  getSearchQuery,
  clearSearchInput,
  results,
  recipeContainer,
  displayBookmarkmsg
};
window.addEventListener('load',function(){
  location.hash=''
})