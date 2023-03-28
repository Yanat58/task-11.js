import axios from 'axios';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchGallery() {
    const key = '34679822-1c5a5d4931a74610a4cbe01cd';
    const url = 'https://pixabay.com/api/';
    const filter = `&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

    return await axios
      .get(`${url}?key=${key}${filter}`)
      .then(responce => responce.data)
      .then(data => {
        console.log(data);

        return data.hits;
      });
  }

  increment() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
