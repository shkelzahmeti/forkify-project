'use strict';

import View from './View.js';
import iconss from 'url:../../img/icons.svg';
import previewView from './previewView.js';
const icons = iconss.split('?')[0];
// console.log(`iconssssssssssss: ${icons}`);

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try again ;)';
  _message = '';
  _generateMarkup() {
    // Here we can call `bookmark` -> `result`.
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new ResultsView();
