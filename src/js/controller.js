import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// const recipeContainer = document.querySelector('.recipe');
// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io
// https://forkify-v2.jonas.io/#664c8f193e7aa067e94e8297

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerUpdateBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome');
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    //console.log(id);

    if (!id) return;

    //1)Load Spinner
    recipeView.renderSpinner();

    //2 Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //3)Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //4)loading recipe
    await model.loadRecipe(id);

    //5)rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    //alert(error);
    recipeView.renderError();
    //console.log(error);
  }
};

const controlSearchResults = async function () {
  try {
    //display spinner
    resultsView.renderSpinner();
    //1 Get search query
    const query = searchView.getQuery();

    if (!query) return;

    //2) Load search results
    await model.loadSearchResults(query);

    //3)Render results
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //Render initial Pagination Buttons
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  //1)Render NEW results
  //resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2)Render NEW Pagination Buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings in the state
  model.updateServings(newServings);

  //Update the recipe view
  //2)rendering the recipe
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //2) Update Recipe View
  recipeView.update(model.state.recipe);

  //3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show spinner
    addRecipeView.renderSpinner();

    //console.log(newRecipe);
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //Render boomark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window/modal
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log('💥', error);
    addRecipeView.renderError(error.message);
  }
};

init();

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes));
