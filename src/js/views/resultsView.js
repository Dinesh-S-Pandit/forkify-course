import View from './view.js';
import icons from 'url:../../img/icons.svg'; //parcel 2
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query! Please try again`;
  _message = '';

  _generateMarkup() {
    return this._data.map(results => previewView.render(results, false)).join('');
    // console.log(this._data);
    // return this._data.map(this._generateMarkupPreview).join('');
  }
}

export default new ResultsView();
