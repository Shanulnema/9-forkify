import {elements} from './base';
export const renderList = item => 
{
const markup =
`<li class="shopping__item" data-itemid=${item.id}>
<div class="shopping__count">
    <input type="number" value="${item.count}" step="${item.count}" class="shopping__count--value" min="0.5">
    <p>${item.unit}</p>
</div>
<p class="shopping__description">${item.ingredient}</p>
<button class="shopping__delete btn-tiny" >
    <svg>
        <use href="dist/img/icons.svg#icon-circle-with-cross"></use>
    </svg>
</button>
</li>`;
elements.shopping.insertAdjacentHTML('beforeEnd', markup);
};

export const deleteItem = id => {
    const item=document.querySelector(`[data-itemid="${id}"]`);
    item.parentElement.removeChild(item);
}

export const deleteBtn = () => {

    const markup1 = `            
    <button class="delete_all btn" >
    <b>Delete All</b>
    </button>`;
    elements.shopping.insertAdjacentHTML('afterEnd', markup1);
    
}
export const deleteAll = () => {
    elements.shopping.innerHTML='';
    const y=document.querySelector('.delete_all');
    
    y.parentElement.removeChild(y);

}