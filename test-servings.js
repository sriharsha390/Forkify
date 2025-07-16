// Simple test to verify serving adjustment logic
const testRecipe = {
  servings: 4,
  ingredients: [
    { quantity: 1000, unit: 'g', description: 'pasta' },
    { quantity: 0.5, unit: 'cup', description: 'ricotta cheese' },
    { quantity: 2, unit: '', description: 'tomatoes' },
    { quantity: null, unit: '', description: 'salt' },
  ],
};

function updateServings(recipe, newServings) {
  const oldServings = recipe.servings;

  // Update ingredients quantities
  recipe.ingredients.forEach(ing => {
    if (ing.quantity) {
      ing.quantity = (ing.quantity * newServings) / oldServings;
    }
  });

  // Update servings count
  recipe.servings = newServings;
}

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

console.log('Original recipe (4 servings):');
console.log(JSON.stringify(testRecipe, null, 2));

// Test increasing to 6 servings
updateServings(testRecipe, 6);
console.log('\nAfter increasing to 6 servings:');
testRecipe.ingredients.forEach(ing => {
  console.log(`${formatQuantity(ing.quantity)} ${ing.unit} ${ing.description}`);
});

// Test decreasing to 2 servings
updateServings(testRecipe, 2);
console.log('\nAfter decreasing to 2 servings:');
testRecipe.ingredients.forEach(ing => {
  console.log(`${formatQuantity(ing.quantity)} ${ing.unit} ${ing.description}`);
});
