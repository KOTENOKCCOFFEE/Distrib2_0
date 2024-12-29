document.addEventListener('DOMContentLoaded', () => {
  // Инициализация Swiper
  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    loop: true,
  });

  const form = document.getElementById('add-card-form');
  const titleInput = document.getElementById('card-title');
  const descriptionInput = document.getElementById('card-description');
  const featuresGrid = document.querySelector('.features-grid'); // Контейнер для карточек
  const clearButton = document.getElementById('clear-cards');

  const savedCards = JSON.parse(localStorage.getItem('cards')) || [];
  let cardCounter = 6;

  // Восстановление сохранённых карточек
  savedCards.forEach((card, index) => {
    addCard(card.title, card.description, index + 7, true);
  });

  // Добавление карточки при отправке формы
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    // Убираем предыдущие ошибки
    titleInput.style.border = '';
    descriptionInput.style.border = '';

    if (!title || !description) {
      // Если поле пустое, подсвечиваем его
      if (!title) titleInput.style.border = '2px solid red';
      if (!description) descriptionInput.style.border = '2px solid red';
      return;
    }

    cardCounter++;
    addCard(title, description, cardCounter);

    savedCards.push({ title, description });
    localStorage.setItem('cards', JSON.stringify(savedCards));

    form.reset();
    updateCounters();
  });

  // Удаление всех добавленных карточек
  clearButton.addEventListener('click', () => {
    // Удаляем только карточки с классом 'user-added'
    const userAddedCards = document.querySelectorAll('.card.user-added');
    userAddedCards.forEach((card) => card.remove());

    // Очищаем localStorage
    localStorage.removeItem('cards');
    cardCounter = 6;
  });

  // Функция для добавления карточки
  function addCard(title, description, number, isSaved = false) {
    const cardHTML = `
      <div class="card ${isSaved ? '' : 'user-added'}">
        <div class="number">${number}</div>
        <h3 class="title">${truncateText(title, 50)}</h3>
        <p class="description">${truncateText(description, 120)}</p>
      </div>`;
    featuresGrid.insertAdjacentHTML('beforeend', cardHTML);
  }

  // Обрезка текста
  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  // Добавление счетчиков символов
  const maxTitleLength = 50;
  const maxDescriptionLength = 120;

  const titleCounter = document.createElement('div');
  const descriptionCounter = document.createElement('div');

  titleCounter.style.textAlign = 'right';
  titleCounter.style.marginBottom = '5px';
  titleCounter.textContent = `0 / ${maxTitleLength}`;
  titleInput.parentNode.insertBefore(titleCounter, titleInput.nextSibling);

  descriptionCounter.style.textAlign = 'right';
  descriptionCounter.style.marginBottom = '5px';
  descriptionCounter.textContent = `0 / ${maxDescriptionLength}`;
  descriptionInput.parentNode.insertBefore(descriptionCounter, descriptionInput.nextSibling);

  titleInput.addEventListener('input', () => {
    const length = titleInput.value.length;
    titleCounter.textContent = `${length} / ${maxTitleLength}`;
    titleCounter.style.color = length > maxTitleLength ? 'red' : 'inherit';
  });

  descriptionInput.addEventListener('input', () => {
    const length = descriptionInput.value.length;
    descriptionCounter.textContent = `${length} / ${maxDescriptionLength}`;
    descriptionCounter.style.color = length > maxDescriptionLength ? 'red' : 'inherit';
  });

  // Функция для сброса счетчиков символов
  function updateCounters() {
    titleCounter.textContent = `0 / ${maxTitleLength}`;
    descriptionCounter.textContent = `0 / ${maxDescriptionLength}`;
  }
});
