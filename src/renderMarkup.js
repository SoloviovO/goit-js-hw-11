import { gallery } from './index';
export function renderCardsOfImages(cards) {
  const markup = cards
    .map(card => {
      return `<a href="${card.largeImageURL}"><div class="photo-card">
  <img src="${card.webformatURL}" alt="${card.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${card.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${card.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${card.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${card.downloads}</b>
    </p>
  </div>
</div></a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
