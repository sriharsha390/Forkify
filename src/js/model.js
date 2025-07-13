const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: 10,
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

// Pagination helper functions
function getSearchResultsPage(page = state.search.page) {
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    
    return state.search.results.slice(start, end);
}

function getNumPages() {
    return Math.ceil(state.search.results.length / state.search.resultsPerPage);
}

export { state, getRecipes, getRecipe, getSearchResultsPage, getNumPages };