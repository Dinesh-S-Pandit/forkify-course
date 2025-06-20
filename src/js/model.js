import { async } from 'regenerator-runtime';
import { API_URL, RESULTS_PER_PAGE, KEY } from './config.js';
import { AJAX, getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bkmark => bkmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    //console.log(state.recipe);
  } catch (error) {
    console.error(`${error} 💥💥💥`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        sourceURL: rec.source_url,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    console.error(`${error} 💥💥💥`);
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  //new quantity = oldquantity * (newservings/oldservings) // 2 * (8 /4) = 4
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark

  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);

  state.bookmarks.splice(index, 1);

  //Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};

const clearBookmarks = function () {
  state.bookmarks = [];
  localStorage.clear('bookmarks');
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

export const uploadRecipe = async function (newRecipe) {
  try {
    //console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') & (entry[1] !== ''))
      .map(ing => {
        //const ingArray = ing[1].replaceAll(' ', '').split(',');
        const ingArray = ing[1].split(',').map((el = el.trim()));

        if (ingArray.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format :)');

        const [quantity, unit, description] = ingArray;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    //console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

init();
// console.log(state.bookmarks);
