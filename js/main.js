const getData = url => fetch(url)
        .then(
            data => data.ok ? data.json() : Promise.reject(data.statusText))
        .catch(
            err => console.log('Carch', err)
        );

const jokeForm = document.querySelector('#jokeForm');        
const jokeFormCats = document.querySelector('#jokeFormCats');
const jokeFormSearch = document.querySelector('#jokeFormSearch');
const jokesContainer = document.querySelector('#jokesContainer');
const jokesContainerFavotite = document.querySelector('#jokesContainerFavotite');


const API = 'https://api.chucknorris.io/jokes';

const URLS = {
    categories: '/categories',
    random: '/random'
}

const rendFromCategories = () => {
    
    getData(API + URLS.categories)
         .then(categories => {
            jokeFormCats.innerHTML = categories.map((categories, index) =>`
         <li class="category__link">
            <label>
            <input type="radio" class="joke__cat" name="jokeCat" value="${categories}" ${!index && 'checked'}>
            ${categories}
            </label>
         </li>
         `).join('');
})


};

rendFromCategories();

jokeForm.addEventListener('submit',(event) => {
 event.preventDefault();

 let jokeType = jokeForm.querySelector('input[name=jokeFormType]:checked').value;
 let jokeUrl = API;

 switch (jokeType) {
    case `random`:
       jokeUrl += URLS.random;
       break;
    case `categories`:
        let checkedCategori = jokeFormCats.querySelector('input[name=jokeCat]:checked').value;
        jokeUrl += `/random?category=${checkedCategori}`;
        break;
    case `search`:
        const queryValue = encodeURIComponent(jokeFormSearch.value);
        if(queryValue.length < 3 || queryValue.length > 120){
            alert('Size must be between 3 and 120');
            return;
        }
        jokeUrl += `/search?query=${queryValue}`
}

getData(jokeUrl).then(data => data.result 
    ? data.result.forEach(joke => renderJoke(joke)) 
    : renderJoke(data));

});



document.getElementById("jokeFormSearch").addEventListener("focus", () => {
    document.getElementById("radio").checked = true;
  });

const renderJokeCats = cats => cats.length ? `<div class="category">${cats.map(categories => `<p class="category__text">${categories}</p>`)}</div>` : '';
const renderJokeText = value => `<p class="joke__text">${value}</p>`;


   

const getLocalStorage = (key, defaultValue = []) => {
    let storage = localStorage.getItem(key);
    storage = storage ? JSON.parse(storage) : defaultValue;

    return storage;
}

const renderJoke = joke => {
    const jokeContent = document.createElement('div');
    jokeContent.dataset.id = joke.id;
    jokeContent.className = 'joke__content';
    jokeContent.innerHTML = [renderJokeText(joke.value), renderJokeCats(joke.categories)].join('');
    
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'favorite__btn';
    favoriteBtn.innerHTML = joke.favorite ? `<img class="vector" src="./img/heart.svg" alt="vector"/>` : `<img class="vector" src="./img/vector.svg" alt="vector"/>`;

    const massImg = document.createElement('button');
    massImg.className = 'massage';
    massImg.innerHTML = `<img class="massage__img" src="./img/massage.svg" alt="massage"/>`;

    const tipogrText = document.createElement('p');
    tipogrText.className = 'typografy';
    tipogrText.innerHTML = `<p class="typografy">ID:<a class="link__id">XNaAxUduSw6zANDaIEab7A</a></p>`

    favoriteBtn.addEventListener('click', () => {
       let storageJokes = getLocalStorage('favoriteJokes');
       let jokeIndexInStorage = storageJokes.findIndex(item => item.id === joke.id);

       if(jokeIndexInStorage === -1){
        joke.favorite = true;
        storageJokes.push(joke);
        jokesContainer.querySelector(`.joke__content[data-id="${joke.id}"] .favorite__btn`).innerHTML = '<img class="vector" src="./img/heart.svg" alt="vector"/>';
        renderJoke(joke);
       } else {
        storageJokes.splice(jokeIndexInStorage, 1);
        jokesContainerFavotite.querySelector(`.joke__content[data-id="${joke.id}"]`).remove();
        let jokeContainerCurrentJoke = jokesContainer.querySelector(`.joke__content[data-id="${joke.id}"]`);

        if(jokeContainerCurrentJoke){
            jokeContainerCurrentJoke.querySelector('.favorite__btn').innerHTML = '<img class="vector" src="./img/vector.svg" alt="vector"/>';
        }
       }

       
       localStorage.setItem('favoriteJokes',JSON.stringify(storageJokes));
       
    });


    jokeContent.prepend(massImg, favoriteBtn);

    joke.favorite ? jokesContainerFavotite.append(jokeContent) : jokesContainer.append(jokeContent);  

    jokeContent.prepend(tipogrText)
};

const renderFavoriteJokes = () => {
    getLocalStorage('favoriteJokes').forEach(item => renderJoke(item));
    
}
renderFavoriteJokes()

const menuBtn = document.querySelector('.burger__fav-btn');
const menu = document.querySelector('.section__favorite');
const burgerFavBlock = document.querySelector('.burger__fav-block');

menuBtn.addEventListener('click', function() {
    menu.classList.toggle('active');
    menuBtn.classList.toggle('active');
    burgerFavBlock.classList.toggle('active');
    
});



