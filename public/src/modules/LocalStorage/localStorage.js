export default class LocalStorage{
    static setItem(key, val){
        localStorage.setItem(key, val);
    }

    static getItem(key){
        return localStorage.getItem(key);
    }

    static removeItem(key){
        if(localStorage.getItem(key))
            localStorage.removeItem(key);
        return localStorage.getItem(key);
    }

    static clearItems(){
        localStorage.clear();
    }    


}