import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const formSearch = document.querySelector('form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

hideBtnLoadMore();

class NewsApiService {
  constructor() {
    this.inputValue = '';
    this.page = 1;
  }
  
  async fetchImages() { 
   return await axios
    .get(`https://pixabay.com/api/?key=34391512-847c3dd62fc26ce6cb8d8814a&q=${this.inputValue}
      &image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`)
    .then(response => {
      this.incrementPage();

      if (response.data.hits.length === 0) {
        hideBtnLoadMore();
        return Promise.reject('Sorry, there are no images matching your search query. Please try again.');
      }

      if (response.data.hits.length >= response.data.totalHits) {
        hideBtnLoadMore();
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      }

        return response.data.hits;
    })
    .catch((error) => {
      Notiflix.Notify.failure(error);
    })
  }

  incrementPage(){
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.inputValue;
  }

  set query(newInputValue) {
    this.inputValue = newInputValue;
  }
}

const ApiService = new NewsApiService();


formSearch.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onLoadMore);


function onSearch(event) {
  event.preventDefault();

  clearGallery();
  ApiService.query = event.currentTarget.elements.searchQuery.value.trim();

  if (ApiService.query === '' || ApiService.query.includes('&')) {
    Notiflix.Notify.failure('Please enter a valid search query.');
    return;
  }
  
  showBtnLoadMore();
  ApiService.resetPage();
  ApiService.fetchImages().then(createCard);
}

function onLoadMore() {
  hideBtnLoadMore()
  ApiService.fetchImages().then(createCard);
  showBtnLoadMore()
}

function clearGallery() {
  gallery.innerHTML = '';
}

function createCard(image) {
  const galleryOfImages = image.map(item =>
    `<div class="photo-card">
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width= 400/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <b>${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views</b>
      <b>${item.views}</b>
      
    </p>
    <p class="info-item">
      <b>Comments</b>
      <b>${item.comments}</b>
      
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <b>${item.downloads}</b>
      
    </p>
  </div>
</div>`)
    .join('');
  
  gallery.insertAdjacentHTML('beforeend', galleryOfImages);
}

function hideBtnLoadMore() {
  btnLoadMore.classList.add('is-hidden');
}

function showBtnLoadMore() {
  btnLoadMore.classList.remove('is-hidden');
}