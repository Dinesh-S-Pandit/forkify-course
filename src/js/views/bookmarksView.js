import View from './view.js';
import icons from 'url:../../img/icons.svg'; //parcel 2
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    // console.log(this._data);
    // return this._data.map(this._generateMarkupPreview).join('');
  }

  //   _generateMarkupPreview(searchResultItem) {
  //     const id = window.location.hash.slice(1);

  //     return `
  //     <li class="preview">
  //             <a class="preview__link ${searchResultItem.id === id ? 'preview__link--active' : ''}" href="#${searchResultItem.id}">
  //               <figure class="preview__fig">
  //                 <img src="${searchResultItem.image}" alt="${searchResultItem.title}" />
  //               </figure>
  //               <div class="preview__data">
  //                 <h4 class="preview__title">${searchResultItem.title}</h4>
  //                 <p class="preview__publisher">${searchResultItem.publisher}</p>
  //                 <!--preview__link--active
  //                 <div class="preview__user-generated">
  //                   <svg>
  //                     <use href="${icons}#icon-user"></use>
  //                   </svg>
  //                 </div>-->
  //               </div>
  //             </a>
  //     </li>
  //     `;
  //   }
}

export default new BookmarksView();
