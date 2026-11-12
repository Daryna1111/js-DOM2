const gallery = document.getElementById('gallery');
const galleryInfo = document.getElementById('gallery-info');
const loadMoreBtn = document.getElementById('load-more-btn');
const reverseBtn = document.getElementById('reverse-btn');
const removeLastBtn = document.getElementById('remove-last-btn');
const clearBtn = document.getElementById('clear-btn');

let currentPage = 1;
const limitPerPage = 4;
const loadedIds = new Set();

function updateCounter() {
  const count = gallery.children.length;
  galleryInfo.textContent = count === 0
    ? 'Галерея порожня'
    : `Показано зображень: ${count}`;
}

function createPhotoCard(photo) {
  const card = document.createElement('article');
  card.className = 'photo-card';

  const img = document.createElement('img');
  img.src = `https://picsum.photos/id/${photo.id}/600/400`;
  img.alt = `Фото автора ${photo.author}`;
  img.loading = 'lazy';

  const caption = document.createElement('div');
  caption.className = 'photo-caption';

  const author = document.createElement('span');
  author.className = 'photo-author';
  author.textContent = photo.author;

  const idBadge = document.createElement('span');
  idBadge.className = 'photo-id';
  idBadge.textContent = `#${photo.id}`;

  caption.append(author, idBadge);
  card.append(img, caption);

  return card;
}

async function fetchAndRenderPhotos() {
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = 'Завантаження...';

  try {
    let addedCount = 0;

    while (addedCount < limitPerPage) {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${currentPage}&limit=${limitPerPage}`
      );

      if (!response.ok) {
        throw new Error(`Помилка HTTP: ${response.status}`);
      }

      const photos = await response.json();
      currentPage += 1;

      if (photos.length === 0) {
        break;
      }

      for (const photo of photos) {
        if (!loadedIds.has(photo.id) && addedCount < limitPerPage) {
          loadedIds.add(photo.id);
          const card = createPhotoCard(photo);
          gallery.appendChild(card);
          addedCount += 1;
        }
      }
    }

    updateCounter();
  } catch (error) {
    galleryInfo.textContent = 'Не вдалося завантажити картинки. Перевірте інтернет.';
  } finally {
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = 'Завантажити ще 4 картинки';
  }
}

loadMoreBtn.addEventListener('click', fetchAndRenderPhotos);

clearBtn.addEventListener('click', () => {
  gallery.innerHTML = '';
  updateCounter();
});

removeLastBtn.addEventListener('click', () => {
  if (gallery.lastElementChild) {
    gallery.lastElementChild.remove();
    updateCounter();
  }
});

reverseBtn.addEventListener('click', () => {
  const cards = Array.from(gallery.children).reverse();
  cards.forEach((card) => gallery.appendChild(card));
});

fetchAndRenderPhotos();