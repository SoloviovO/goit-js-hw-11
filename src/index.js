import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiService from './fetchImages';
import throttle from 'lodash.throttle';
import { renderCardsOfImages } from './renderMarkup';

const form = document.querySelector('#search-form');
export const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiService = new ApiService();

form.addEventListener('submit', onSubmitForm);
// Закоментована функціональність кнопки Завантажити більше
// Для ввімкнення даної можливості слід розкоментувати всі коментарі
// і закоментувати блок Обробка при скролі

// loadMore.addEventListener('click', onLoadMoreBtnClick);
btnHidden();

function onSubmitForm(event) {
  event.preventDefault();
  btnHidden();
  apiService.query = event.target.elements.searchQuery.value;

  if (apiService.query === '') {
    return Notify.failure(
      'Sorry, please type something in the search bar. Your request is empty.'
    );
  }
  apiService.resetPage();
  apiService.fetchImages().then(photos => {
    // if (photos.totalHits > 40) {
    //   btnVisualy();
    // } else {
    //   btnHidden();
    // }
    Notify.info(`Hooray! We found ${photos.totalHits} images.`);
    clearGallery();
    renderCardsOfImages(photos.hits);
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    }).refresh();
  });
}
function clearGallery() {
  gallery.innerHTML = '';
}

function btnHidden() {
  loadMore.classList.add('is-hidden');
}

function btnVisualy() {
  loadMore.classList.remove('is-hidden');
}

// function onLoadMoreBtnClick() {
//   apiService.fetchImages().then(photos => {
//     if (photos.totalHits / 40 > apiService.page) {
//       btnVisualy();
//     } else {
//       Notify.failure(
//         "We're sorry, but you've reached the end of search results."
//       );
//       btnHidden();
//     }
//     renderCardsOfImages(photos.hits);
//     const lightbox = new SimpleLightbox('.gallery a', {
//       captionsData: 'alt',
//       captionDelay: 250,
//     }).refresh();
//   });
// }

// =================== Обробка при скролі =============================

function onLoadMoreScroll() {
  apiService.fetchImages().then(photos => {
    if (photos.totalHits / 40 < apiService.page - 1) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    renderCardsOfImages(photos.hits);
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
