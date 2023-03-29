export function galleryMarkup(image) {
  return image
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a class="gallery-link" href="${largeImageURL}">
  <img class="gallery-image" loading="lazy"
  src="${webformatURL}" 
  sourceAttr="${largeImageURL}"
  alt="${tags}"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes </b>${likes}
    </p>
    <p class="info-item">
      <b>Views </b>${views}
    </p>
    <p class="info-item">
      <b>Coments </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads </b>${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join();
}
