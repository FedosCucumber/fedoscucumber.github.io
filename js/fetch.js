window.addEventListener("load", function () {
    const cardsContainer = document.querySelector(".cards__container")
    const loader = document.createElement("div")
    loader.classList.add("spinner")
    loader.classList.add("spinner-slow")
    cardsContainer.appendChild(loader)
    dataFetch(cardsContainer)
});

function dataFetch(cardsContainer) {
    removeLoader()
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Occured network exception");
            }
            return response.json();
        })
        .then(data => {
            fetch("https://jsonplaceholder.typicode.com/photos")
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error("Occured network exception");
                    }
                    return response.json();
                }).then(photos => {
                Math.floor(Math.random());
                const dataSlice = data.slice(0, getRandomInd(data));
                dataSlice.forEach(postObject => {
                    const card = {
                        description: postObject.body.substring(0, 161),
                        title: postObject.title.substring(0, 21),
                        ibu: (Math.random() * 10).toFixed(2) + "%",
                        abv: (Math.random() * 20).toFixed(),
                        score: (Math.random() * 5).toFixed(1)
                    };
                    const logo = getRandomElement(photos).url
                    const count = Math.floor(Math.random() * 2) + 1
                    let images = []
                    for (let i = 0; i < count; i++) {
                        images.push(getRandomElement(photos).url)
                    }
                    createCard(card, logo, images, resize)
                });
            })
        })
        .catch(function () {
            console.log("Outer catch")
            showError(cardsContainer)
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
        imageProvider(logoImg, logo)
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


function getRandomElement(arr) {
    const random = Math.floor(Math.random() * arr.length);
    return arr[random]
}

function getRandomInd(arr) {
    return Math.floor(Math.random() * arr.length);
}

function removeLoader() {
    const loader = document.querySelector(".spinner")
    loader.style.display = "none"
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

function showError(cardsContainer) {
    cardsContainer.innerHTML = "<div class=\"alert alert-error text\">\n" +
        "            <div class=\"icon__wrapper\">\n" +
        "                <span>⚠</span>\n" +
        "            </div>\n" +
        "            <p>Произошла непредвиденная ошибка</p>\n" +
        "        </div>"
}
