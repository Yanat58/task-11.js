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

function onSearchFormSubmit(e) {
  e.preventDefault();

  apiService.query = e.currentTarget.elements.searchQuery.value;

  if (apiService.query === '') {
    Notify.info(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    refs.galleryBox.innerHTML = '';
    return;
  }
  apiService.resetPage();
  apiService.fetchGallery().then(hits => {
    clearGalleryMarkup();
    appendGalleryMarkup(hits);
  });
}

function onLoadMoreClick() {
  apiService.fetchGallery().then(appendGalleryMarkup);
}

function appendGalleryMarkup(hits) {
  refs.galleryBox.insertAdjacentHTML('beforeend', galleryMarkup(hits));
}

function clearGalleryMarkup() {
  refs.galleryBox.innerHTML = '';
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
  captionClass: 'image-title',
});

function quantityGalery(hits, totalHits) {
  if (hits.length < totalHits) {
    clearGalleryMarkup;
    refs.galleryBox.insertAdjacentHTML('beforeend', galleryMarkup(hits));
    lightbox.refresh();
  }

  if (hits.length === totalHits) {
    Notify.info(`Hooray! We found ${totalHits} images.`);
    clearGalleryMarkup();
    refs.galleryBox.insertAdjacentHTML('beforeend', galleryMarkup(hits));
    lightbox.refresh();
    return;
  }
}
