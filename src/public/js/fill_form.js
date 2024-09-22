function processForm() {

    const cardForm = document.getElementById('cardForm');
    const nameInput = document.getElementById('name')
    const abvInput = document.getElementById('abv')
    const ibuInput = document.getElementById('ibu')
    const descriptionInput = document.getElementById('description')
    const scoreInput = document.getElementById('score')
    const logo = document.getElementById("logo")
    const images = document.getElementById("images")

    nameInput.value = localStorage.getItem('name') || ''
    abvInput.value = localStorage.getItem('abv') || ''
    ibuInput.value = localStorage.getItem('ibu') || ''
    descriptionInput.value = localStorage.getItem('description') || ''
    scoreInput.value = localStorage.getItem('score') || ''

    cardForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const card = {
            description: descriptionInput.value,
            title: nameInput.value,
            ibu: ibuInput.value,
            abv: abvInput.value,
            score: scoreInput.value
        };

        localStorage.setItem('name', card.title)
        localStorage.setItem('abv', card.abv)
        localStorage.setItem('ibu', card.ibu)
        localStorage.setItem('description', card.description)
        localStorage.setItem('score', card.score)
        createCard(card, logo.files, images.files, createAndResizeImage)
        cardForm.reset();
    });
}

function createCard(cardData, logo, imageFiles, imageProvider) {

    const cardContainer = document.querySelector(".cards__container")

    const newCard = document.createElement('article');
    newCard.className = 'card card_border';

    const cardContent = document.createElement('div');
    cardContent.className = 'card__content';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card__header';

    const cardImage = document.createElement('div');
    cardImage.className = 'card__image';
    const logoImg = document.createElement('img');

    if (logo.length > 0) {
        imageProvider(logoImg, logo[0])
    } else {
        logoImg.src = 'img/placeholder.jpg'
    }
    logoImg.alt = 'Лого';

    cardImage.appendChild(logoImg);
    cardHeader.appendChild(cardImage);

    const cardTitle = document.createElement('div');
    cardTitle.className = 'card__title text';
    const titleHeading = document.createElement('h4');
    titleHeading.textContent = cardData.title;
    cardTitle.appendChild(titleHeading);

    cardHeader.appendChild(cardTitle);
    cardContent.appendChild(cardHeader);

    const cardDescription = document.createElement('div');
    cardDescription.className = 'card__description';

    const info = document.createElement('div');
    info.className = 'info text text_small';
    const abvSpan = document.createElement('span');
    abvSpan.className = 'info__abv';
    abvSpan.innerHTML = '<i>ABV: ' + cardData.abv + '</i>';
    const ibuSpan = document.createElement('span');
    ibuSpan.className = 'info__ibu';
    ibuSpan.innerHTML = '<i>IBU: ' + cardData.ibu + '</i>';
    info.appendChild(abvSpan);
    info.appendChild(ibuSpan);

    const textDescription = document.createElement('div');
    textDescription.className = 'text-description text text_small';
    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.textContent = cardData.description;
    textDescription.appendChild(descriptionParagraph);

    const stats = document.createElement('div');
    stats.className = 'stats text text_small';
    const ratingSpan = document.createElement('span');
    ratingSpan.className = 'stats__rating';
    ratingSpan.innerHTML = 'Оценка: <b>' + cardData.score + '</b>';
    stats.appendChild(ratingSpan);

    cardDescription.appendChild(info);
    cardDescription.appendChild(textDescription);
    cardDescription.appendChild(stats);

    if (imageFiles.length > 0) {
        const images = document.createElement('div')
        images.classList.add("images")
        for (let i = 0; i < imageFiles.length; i++) {
            const imageItem = document.createElement("div")
            imageItem.classList.add("images__item")
            images.appendChild(imageItem)
            const img = document.createElement('img');
            imageItem.appendChild(img)
            const currentPhoto = imageFiles[i]
            imageProvider(img, currentPhoto)
        }
        cardDescription.appendChild(images)
    }

    cardContent.appendChild(cardDescription);
    newCard.appendChild(cardContent);

    cardContainer.appendChild(newCard);
}

function createAndResizeImage(imageElement, imageSource) {
    const reader = new FileReader();
    reader.readAsDataURL(imageSource);
    reader.onload = function () {
        resize(imageElement, reader.result)
    }
}

function resize(imageElement, imageSource) {
    imageElement.src = imageSource;
    imageElement.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 524;
        canvas.height = 524;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
        imageElement.src = canvas.toDataURL();
    }
}

window.addEventListener("load", processForm)
