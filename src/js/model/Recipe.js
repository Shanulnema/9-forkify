
import axios from 'axios';
import uniqid from 'uniqid';

export default class Recipe{
    constructor(id){
        this.id = id;
    }
    
    async getResults(){
    try
    {
        const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
        this.title= res.data.recipe.title;
        this.author= res.data.recipe.publisher;
        this.img= res.data.recipe.image_url;
        this.url= res.data.recipe.source_url;
        this.ingredients= res.data.recipe.ingredients;
        
    }catch(error){
        console.log(error);
        alert('Something went wrong :(');
        
    }
}
    calcTime(){
        //assuming every 3 ingerdients takes 15min of time
        const x = Math.ceil(this.ingredients.length/3);
        this.time = x*15 ; 
    }
    calcServings(){
        this.servings = 4;
    }
    parseIngredients(){
        const unitslong = ['tablespoons','tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngredients = this.ingredients.map(el => {
            //uniform units
            let id = uniqid();
            let ingredient = el.toLowerCase();
            unitslong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });


            //remove parenthesis
            ingredient=ingredient.replace(/ *\([^)]*\) */g, ' ');

            //parse ingredients into count, unit & ingredient

            const arrIng = ingredient.split(' ');                                 //getting each word of an ingredient
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));  // finding the index of unit

            let objIng;                                                           //obj containing all parts of ing
            if (unitIndex> -1){                                                   // if there is a unit
                const arrCount = arrIng.slice(0, unitIndex);                      // number in ing
                

                let count;
                if(arrCount.length === 1){                                               //just single no.
                    count = eval(arrIng[0].replace('-', '+'));                    // 2 or 2-1/3 cups
                } else{
                    count = eval(arrIng.slice(0, unitIndex).join('+'));           // for no.'s like 2 1/3 => eval('2 + 1/3
                
                }
                objIng = {
                    id,
                    count,
                    unit:arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }  
            }
            else if(parseInt(arrIng[0], 10)){                                      // 1 package
                objIng = {
                    id,
                    count:arrIng[0],
                    unit:'',
                    ingredient: arrIng.slice(1).join(' ')
                }      
            }else if(unitIndex === -1){
                objIng = {
                    id,
                    count:'',
                    unit:'',
                    ingredient
                }  
            }
            return objIng;

            });
            this.ingredients=newIngredients;
    }

    updateServings(type) {
        const newServings = type === 'dec' ? this.servings -1 : this.servings +1;
        this.ingredients.forEach(el => {
            el.count *= newServings/this.servings;
        });
        this.servings = newServings;
        
    }
        
} 
