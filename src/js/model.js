
const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
    },
    bookmarks: [],
};

async function getRecipes(query) {
    try {
        const res = await fetch(`https://forkify-api.jonas.io/api/v2/recipes/?search=${query}`);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        state.search.results = data.data.recipes;
        return data;
    } catch (err) {
        console.error(`${err} 💥💥💥💥`);
        throw err;
    }
}

async function getRecipe(id) {
    try {
        const res = await fetch(`https://forkify-api.jonas.io/api/v2/recipes/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        state.recipe = data.data.recipe;
        return data;
    } catch (err) {
        console.error(`${err} 💥💥💥💥`);
        throw err;
    }
}

export { state, getRecipes, getRecipe };