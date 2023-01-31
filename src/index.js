import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiService from './fetchImages';
import throttle from 'lodash.throttle';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import renderCards from './templates/render-card.hbs';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

const apiService = new ApiService();

form.addEventListener('submit', onSubmitForm);

function onSubmitForm(event) {
  event.preventDefault();
  apiService.query = event.target.elements.searchQuery.value;

  if (apiService.query === '') {
    return Notify.failure(
      'Sorry, please type something in the search bar. Your request is empty.'
    );
  }
  apiService.resetPage();

  apiService.fetchImages().then(photos => {
    Notify.info(`Hooray! We found ${photos.totalHits} images.`);
    clearGallery();
    gallery.insertAdjacentHTML('beforeend', renderCards(photos.hits));
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    }).refresh();
  });
}

function onLoadMoreScroll() {
  apiService.fetchImages().then(photos => {
    if (photos.totalHits / 40 < apiService.page - 1) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    gallery.insertAdjacentHTML('beforeend', renderCards(photos.hits));
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    }).refresh();
  });
}

window.addEventListener('scroll', throttle(onScrollCards, 100));

function onScrollCards() {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 150) {
    onLoadMoreScroll();
  }
}

function clearGallery() {
  gallery.innerHTML = '';
}
