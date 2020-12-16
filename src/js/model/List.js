import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.items = [];
    }
    addItems(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        this.persistData();
        return item;
    }
    deleteItem(id){
         const index = this.items.findIndex(el => el.id === id);
         this.items.splice(index, 1);
         this.persistData();
    }

    updateCount(id, newCount){
        this.items.find(el => el.id===id).count = newCount;
    }
    delete(){
        this.items = [];
        this.persistData();
    }
    getNumList(){
        return this.items.length;
    }
    persistData() {
        localStorage.setItem('list', JSON.stringify(this.items));
    }
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('list'));
        if(storage) this.items = storage;
    }
}