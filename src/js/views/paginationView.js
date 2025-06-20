import View from './view.js';
import icons from 'url:../../img/icons.svg'; //parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      //console.log(btn);
      const goToPage = +btn.dataset.goto;
      //console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPage = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    const curPage = this._data.page;

    //Page 1 and there are other pages
    if (curPage === 1 && numPage > 1) {
      return this._generateNextButtonMarkup(curPage);
      //   return `
      //     <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
      //         <span>Page ${curPage + 1}</span>
      //         <svg class="search__icon">
      //           <use href="${icons}#icon-arrow-right"></use>
      //         </svg>
      //     </button>
      //   `;
    }

    //Last page
    if (curPage === numPage && numPage > 1) {
      return this._generatePreviousButtonMarkup(curPage);
      //   return `
      // <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
      //         <svg class="search__icon">
      //           <use href="${icons}#icon-arrow-left"></use>
      //         </svg>
      //         <span>Page ${curPage - 1}</span>
      // </button>
      //   `;
    }
    //Other Page
    if (curPage < numPage) {
      return `${this._generatePreviousButtonMarkup(curPage)}${this._generateNextButtonMarkup(curPage)}`;
      //   return `
      //     <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
      //         <svg class="search__icon">
      //           <use href="${icons}#icon-arrow-left"></use>
      //         </svg>
      //         <span>Page ${curPage - 1}</span>
      //     </button>
      //     <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
      //         <span>Page ${curPage + 1}</span>
      //         <svg class="search__icon">
      //           <use href="${icons}#icon-arrow-right"></use>
      //         </svg>
      //     </button>
      //     `;
    }
    //Page 1 and there are NO other pages
    return '';
  }

  _generateNextButtonMarkup(curPage) {
    return `
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button> 
    `;
  }
  _generatePreviousButtonMarkup(curPage) {
    return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button> 
        `;
  }
}

export default new PaginationView();
