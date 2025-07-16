import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import * as view from './view.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const searchForm = view.qs('.search');
searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const dishName = view.getSearchQuery();
  view.renderSpinner(view.results);

  try {
    await model.getRecipes(dishName);
    // Reset to page 1 for new search
    model.state.search.page = 1;
    renderSearchResults();
  } catch (err) {
    console.error('Error searching recipes:', err);
  }
});

// Render search results with pagination
function renderSearchResults() {
  const results = model.getSearchResultsPage();
  const numPages = model.getNumPages();

  console.log('Rendering search results:', results.length, 'results');
  console.log(
    'Current page:',
    model.state.search.page,
    'Total pages:',
    numPages
  );

  view.renderSearchResults(results);
  view.renderPagination(model.state.search.page, numPages);
}

async function renderRecipe(id) {
  view.renderSpinner(view.recipeContainer);

  try {
    await model.getRecipe(id);
    view.renderRecipe(model.state.recipe);
  } catch (err) {
    console.error('Error loading recipe:', err);
  }
}
view.results.addEventListener('click', function (e) {
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

// Pagination event handler
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.btn--inline');
  if (!btn) return;

  const goToPage = parseInt(btn.dataset.goto);
  if (goToPage) {
    console.log('Pagination clicked, going to page:', goToPage);
    model.state.search.page = goToPage;
    renderSearchResults();
  }
});

document.addEventListener('click', function (e) {
  const btn = e.target.closest('.btn--round');
  if (!btn) return;

  console.log('Bookmark button clicked!'); // Add this debug line

  sessionStorage.setItem('recipe', JSON.stringify(model.state.recipe));
  let allRecipes = JSON.parse(sessionStorage.getItem('recipes')) || [];
  const exists = allRecipes.some(r => r.id === model.state.recipe.id);
  if (!exists) {
    allRecipes.push(model.state.recipe);
    sessionStorage.setItem('recipes', JSON.stringify(allRecipes));
    console.log('Calling displayBookmarkmsg...'); // Add this debug line
    view.displayBookmarkmsg('Bookmark Added Successfully!');
  } else {
    view.displayBookmarkmsg('removing bookmark');
    allRecipes = allRecipes.filter(r => r.id !== model.state.recipe.id);
    sessionStorage.setItem('recipes', JSON.stringify(allRecipes));
  }
  console.log(allRecipes);
});

// Servings adjustment event handler
document.addEventListener('click', function (e) {
  const increaseBtn = e.target.closest('.btn--increase-servings');
  const decreaseBtn = e.target.closest('.btn--decrease-servings');

  if (!increaseBtn && !decreaseBtn) return;

  const currentServings = model.state.recipe.servings;
  let newServings;

  if (decreaseBtn) {
    newServings = currentServings > 1 ? currentServings - 1 : 1;
  } else if (increaseBtn) {
    newServings = currentServings + 1;
  }

  // Update servings in model
  model.updateServings(newServings);

  // Re-render recipe with updated quantities
  view.renderRecipe(model.state.recipe);
});

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, function () {
    const id = window.location.hash.slice(1);
    if (!id) return;
    renderRecipe(id);
  })
);
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.nav__btn--bookmarks');
  console.log(btn);
  if (!btn) return;
  const recipe = JSON.parse(sessionStorage.getItem('recipes'));
  console.log(recipe);
  model.state.search.results = recipe;
  renderSearchResults();
});
