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
    view.renderSearchResults(model.state.search.results);
  } catch (err) {
    console.error('Error searching recipes:', err);
  }
});

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

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, function () {
    const id = window.location.hash.slice(1);
    if (!id) return;
    renderRecipe(id);
  })
);
