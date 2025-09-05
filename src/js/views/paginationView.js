'use strict';

import View from './View.js';
import iconss from 'url:../../img/icons.svg';
const icons = iconss.split('?')[0];

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      // console.log(goToPage);

      handler(goToPage);
    });
  }
  _generateMarkupButton(pageDirection) {
    const currPage = this._data.page;
    const btnSuffix = pageDirection === 1 ? 'next' : 'prev';
    const iconSuffix = pageDirection === 1 ? 'right' : 'left';
    return `
    <button data-goto="${
      currPage + pageDirection
    }" class="btn--inline pagination__btn--${btnSuffix}">
      <span>Page ${currPage + pageDirection}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${iconSuffix}"></use>
      </svg>
    </button>
    `;
  }
  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);
    // SCENARIO 1: We're on Page 1, and there are other pages.
    if (currPage === 1 && numPages > 1) {
      // return 'Page 1, Others';
      return this._generateMarkupButton(1);
    }
    // SCENARIO 2: We're on Last Page.
    if (currPage === numPages && numPages > 1) {
      // return 'Last page';
      return this._generateMarkupButton(-1);
    }
    // SCENARIO 3: We're on some Other(middle) Page
    if (currPage < numPages) {
      // return 'Other page';

      return `
         ${this._generateMarkupButton(-1)}
         ${this._generateMarkupButton(1)}
      `;
    }
    // SCENARIO 4: We're on Page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();
