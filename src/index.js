import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './js/api-service';
import { galleryMarkup } from './js/markup-template';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const apiService = new ApiService();

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

async function onSearchFormSubmit(e) {
  e.preventDefault();

  apiService.query = e.currentTarget.elements.searchQuery.value;

  // const { hits, totalHits } = await apiService.fetchGallery(
  //   apiService.query,
  //   apiService.page
  // );
  apiService.resetPage();

  const { hits, totalHits } = await apiService.fetchGallery();
  if (totalHits > 40) {
    refs.loadMoreBtn.classList.add('is-hidden');
  } else {
    refs.loadMoreBtn.classList.remove('is-hidden');
  }
  if (apiService.query.trim() === '') {
    Notify.info(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    return;
  }
  // quantityGalery();

  // apiService.fetchGallery().then(hits => {
  //   clearGalleryMarkup();
  //   appendGalleryMarkup(hits);
  //   lightbox.refresh();
  // });

  let quantityHits = 0;
  quantityHits += hits.length;
  if (hits.length === 0) {
    Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    return;
  }

  if (hits.length > 0) {
    Notify.info(`Hooray! We found ${totalHits} images.`);
    apiService.resetPage();
    clearGalleryMarkup;
    appendGalleryMarkup(hits);
  }

  if (hits.length === totalHits) {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
    refs.loadMoreBtn.classList.add('is-hidden');
  }
}

function onLoadMoreClick() {
  apiService.fetchGallery().then(appendGalleryMarkup);
}

function appendGalleryMarkup(hits) {
  refs.galleryBox.insertAdjacentHTML('beforeend', galleryMarkup(hits));
  lightbox.refresh();
}

function clearGalleryMarkup() {
  refs.galleryBox.innerHTML = '';
}

// async function quantityGalery(hits, totalHits) {
//   const { hits, totalHits } = await apiService.fetchGallery(hits, totalHits);
//   let quantityHits = 0;
//   quantityHits += hits.length;
//   if ((totalHits = 0)) {
//     Notify.failure(
//       `Sorry, there are no images matching your search query. Please try again.`
//     );
//     return;
//   }

//   if (totalHits > 0) {
//     Notify.info(`Hooray! We found ${totalHits} images.`);
//     clearGalleryMarkup;
//     appendGalleryMarkup(hits);
//   }

//   if (hits.length === totalHits) {
//     Notify.info(`We're sorry, but you've reached the end of search results.`);
//     refs.loadMoreBtn.classList.add('is-hidden');
//   }
// }
