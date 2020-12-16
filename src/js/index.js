import Search from './model/search';
import Recipe from './model/Recipe';
import List from './model/List';
import Likes from './model/Likes'
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import {elements, renderLoader, clearLoader} from './view/base';



/**Global state of the app
 *  - Search object
 *  - Current recipe object
 *  - Shopping List object
 *  - Liked recipes
 */

 const state ={};
window.state = state;

 //Search COntroller

 const controlSearch = async() => {
     // Get query from view
     const query = searchView.getInput();
     //console.log(query);

     if (query){
     // New search object and add to state
     state.search = new Search(query);

     // Prepare UI for results
     searchView.clearInput();
     searchView.clearResults();
     renderLoader(elements.searchRes);
try{    
     // Search for recipes
    await state.search.getResults();

    // Render results on ui
    clearLoader();
    searchView.renderResults(state.search.results);

} catch(error){
    alert('something went wrong!');
}


     }

 }

 elements.searchForm.addEventListener('submit', e => {
     e.preventDefault();
     controlSearch();
 });

 elements.searchResPages.addEventListener('click', e => {
     const btn = e.target.closest('.btn-inline');
     if(btn){
         const gotopage = parseInt(btn.dataset.goto, 10);
         searchView.clearResults();
         searchView.renderResults(state.search.results, gotopage);
     }
 })

//Recipe Controller
const controlRecipe = async() => {
    //get id from url
    const id = window.location.hash.replace('#', '');
    

    if(id){
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if(state.search) searchView.highlight(id);

        //create new recipe object
        state.recipe = new Recipe(id);
      
           //get data for recipe object
            await state.recipe.getResults();
            
            state.recipe.parseIngredients();
            

            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

             //render recipe
             clearLoader();
             recipeView.renderRecipe(
                 state.recipe,
                 state.likes.isliked(id)
                );


           
           
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//List Controller
const controlList = () => {
    //create a new list if there is none
    if(!state.list) state.list = new List();
    if(state.list.items.length == 0)listView.deleteBtn();
    //add items to the list
    
    state.recipe.ingredients.forEach(el => {
        const x= state.list.addItems(el.count, el.unit, el.ingredient);
        listView.renderList(x);
        
    })
}

elements.shopping.addEventListener('click', e=> {
    const id =e.target.closest('.shopping__item').dataset.itemid;
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
    //handling delete button
    state.list.deleteItem(id);
    listView.deleteItem(id);

    } else if(e.target.matches('.shopping__count--value')){
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id, val);
    }
});
document.querySelector('.shopping').addEventListener('click', e=> {
    if(e.target.matches('.delete_all, .delete_all *')){
        listView.deleteAll();
        state.list.delete();
        return;
    } 
});

//likes Controller
const controlLikes =() => {
    if(!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    if(!state.likes.isliked(currentId)){

        //add recipe to likes list
        const newLike =state.likes.addLike(
            currentId, 
            state.recipe.title, 
            state.recipe.author, 
            state.recipe.img
            );

        //toggle like button
        likesView.toggleLikeBtn(true);
        //add to ui
        likesView.renderLike(newLike);

    } else {

        //remove recipe to likes list
        state.likes.deleteLike(currentId);

        //toggle like button
        likesView.toggleLikeBtn(false);

        //add to ui
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//restoring liked recipe on page load
window.addEventListener('load', () => {

state.likes = new Likes();
state.likes.readStorage();

state.list =new List();
state.list.readStorage();


likesView.toggleLikeMenu(state.likes.getNumLikes());
state.likes.likes.forEach(like => likesView.renderLike(like));
state.list.items.forEach(list => listView.renderList(list));
if(state.list.items.length > 0) listView.deleteBtn();
});

//handling recipe buttons clicks
elements.recipe.addEventListener('click', e=> {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIng(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')){
     state.recipe.updateServings('inc');
     recipeView.updateServingsIng(state.recipe);

    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        
      controlList();
      


    } else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLikes();

    } else if(e.target.matches('.recipe__icon, .recipe__icon *')){

        if(!state.list) state.list = new List();
        const id =e.target.closest('.recipe__item').dataset.itemid;
        const el= state.recipe.ingredients[state.recipe.ingredients.findIndex(x => x.id == id)];
        const x= state.list.addItems(el.count, el.unit, el.ingredient);
        listView.renderList(x);
    }
    
})