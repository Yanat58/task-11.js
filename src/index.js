import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './js/api-service';
import { galleryMarkup } from './js/markup-template';
import LoadMoreBtn from './js/load-more-btn';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryBox: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const apiService = new ApiService();

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreClick);

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

let quantityHits = 0;

async function onSearchFormSubmit(e) {
  e.preventDefault();

  apiService.query = e.currentTarget.elements.searchQuery.value;
  loadMoreBtn.show();
  console.log(apiService.page);
  apiService.page = 1;
  const { hits, totalHits } = await apiService.fetchGallery(
    apiService.query,
    apiService.page
  );

  if (totalHits > 10) {
    loadMoreBtn.enable();
  } else {
    loadMoreBtn.disable();
  }

  if (apiService.query.trim() === '') {
    Notify.info(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    return;
  }

  quantityHits += hits.length;
  if (totalHits === 0) {
    Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    return;
  }

  if (totalHits > 0) {
    Notify.info(`Hooray! We found ${totalHits} images.`);

    clearGalleryMarkup();
    appendGalleryMarkup(hits);
  }

  if (quantityHits === totalHits) {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
    loadMoreBtn.enable();
  }
}

async function onLoadMoreClick() {
  try {
    const { hits, totalHits } = await apiService
      .fetchGallery
      // apiService.query,
      // apiService.page
      ();
    apiService.page += 1;
    console.log(apiService.page);
    appendGalleryMarkup(hits);
    loadMoreBtn.show();
    loadMoreBtn.disable();
    loadMoreBtn.enable();

    quantityHits = 0;
    quantityHits += hits.length;
    if (quantityHits === totalHits) {
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      loadMoreBtn.enable();
    }
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');
    clearGalleryMarkup();
  }
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
