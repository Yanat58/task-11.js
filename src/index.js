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
console.log(loadMoreBtn);
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
  loadMoreBtn.hide();
  apiService.query = e.currentTarget.elements.searchQuery.value;

  apiService.resetPage();
  const { hits, totalHits } = await apiService.fetchGallery();

  if (totalHits > 30) {
    loadMoreBtn.show();
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

  if (totalHits === hits.length) {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
    loadMoreBtn.hide();
  }
}

async function onLoadMoreClick() {
  try {
    apiService.incrementPage();
    const { hits, totalHits } = await apiService.fetchGallery();
    appendGalleryMarkup(hits);
    console.log(await apiService.fetchGallery());
    quantityHits += hits.length;

    loadMoreBtn.show();
    loadMoreBtn.disable();
    loadMoreBtn.enable();
    console.log(hits.length);
    console.log(totalHits);
    сonsole.log(quantityHits);
    if (quantityHits === totalHits) {
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      loadMoreBtn.hide();
    }
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');
    clearGalleryMarkup();
  }
}

function appendGalleryMarkup(photo) {
  refs.galleryBox.insertAdjacentHTML('beforeend', galleryMarkup(photo));
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
