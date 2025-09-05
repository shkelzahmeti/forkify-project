'use strict';

import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Hot Module Reloading
// Preserves App State on Page Reload
// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    // renderSpinner(recipeContainer);
    recipeView.renderSpinner();

    //0).
    resultsView.update(model.getSearchResultsPage());

    //1. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2. Loading Recipe
    await model.loadRecipe(id);
    // const { recipe } = model.state; //Don't need it anymore

    //3. Rendering Recipe:
    recipeView.render(model.state.recipe);
  } catch (err) {
    // console.log(err);
    recipeView.renderError();
    console.error(err);
  }
};

// controlRecipes();

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // console.log(resultsView);

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  console.log(goToPage);

  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);
  // Update the View(`recipeView.js`)
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

///////////////////////////////////////
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner (added last)
    addRecipeView.renderSpinner();

    // Upload the new recipe data:
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe:
    recipeView.render(model.state.recipe);

    // Success message:
    addRecipeView.renderMessage();

    // Render bookmark view:
    bookmarksView.render(model.state.bookmarks);
    // We're not using `.update(..)` because
    // we really want to insert a new element

    // Change ID in URL (we can use History API)
    // `window.history` is the history API of the browsers.
    // Then on this `history` object we can call the `pushState`
    // method, which allows us to change the URL without reloading
    // the page. It takes 3 arguments:
    //     1. state - doesn't matter, specify it `null`.
    //     2. title - also not relevant, use empty string ''.
    //     3. url - 3rd one is the url.
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
    // E.g. type a nr in Ingredient 4 in UI.
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
