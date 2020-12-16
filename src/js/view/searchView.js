import {elements, elementStrings} from './base';

export const getInput =() => elements.searchInput.value;

export const clearInput = () => {elements.searchInput.value = '';};

export const clearResults = () => { 
    elements.searchResList.innerHTML='';
    elements.searchResPages.innerHTML='';
};

export const highlight = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    
    
    document.querySelector(`a[href*="${id}"]`).classList.add('.results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newtitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            
            if(acc + cur.length <= limit){
                 newtitle.push(cur);
                 return acc + cur.length;
             }
             
             
    }, 0);
    return `${newtitle.join(' ')}...`; //final shortened title
     
    }
    return title; //if title doesn't enter if loop i.e it is short enough
}


const renderRecipe = recipe => {
    const markup = `                
    <li>
    <a class="results__link results__link--active" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}.</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
    </li>`;
    elements.searchResList.insertAdjacentHTML('beforeEnd', markup);
};

const renderButtons = (page, noOfResults, resPerPage) => {
    const pages = Math.ceil(noOfResults / resPerPage); 
    console.log(pages);

    let button;

    if(page === 1 && pages> 1){
    button =`<button class="btn-inline results__btn--next" data-goto =2>
    <svg class="search__icon">
    <use href="dist/img/icons.svg#icon-triangle-right"></use>
    </svg>
    <span>Page 2</span>
    </button>` ;
    }
    else if(page < pages){
    button = 
    `<button class="btn-inline results__btn--next" data-goto =${page + 1}>
    <svg class="search__icon">
    <use href="dist/img/icons.svg#icon-triangle-right"></use>
    </svg>
    <span>Page ${page + 1}</span>
    </button>
    <button class="btn-inline results__btn--prev" data-goto = ${page - 1}>
    <svg class="search__icon">
    <use href="dist/img/icons.svg#icon-triangle-left"></use>
</svg>
    <span>Page ${page - 1}</span>
    </button>
    `; 

    } else if (page == pages && pages> 1) {   
        button = `<button class="btn-inline results__btn--prev" data-goto = ${page - 1}>
        <svg class="search__icon">
            <use href="dist/img/icons.svg#icon-triangle-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
        </button>`;}
    
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {

    const start = (page-1) * resPerPage;
    const end= (page) * resPerPage ; 
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
};