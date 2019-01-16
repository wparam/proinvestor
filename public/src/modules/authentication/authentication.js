const TOKEN = 'astoken';

export default class Authentication{
    //token format:
    //{ token:  res.token, created: timestamp, expired: res.expired }
    static setToken(val){
        localStorage.setItem(TOKEN, JSON.stringify(val));
    }

    static getToken(){
        let tokenObj = localStorage.getItem(TOKEN);
        if(tokenObj)
            return JSON.parse(tokenObj);
        return null;
    }

    static removeToken(){
        if(localStorage.getItem(TOKEN))
            localStorage.removeItem(TOKEN);
        return localStorage.getItem(TOKEN);
    }

    static clearTokens(){
        localStorage.clear();
    }    

    //TODO: ignore client timezone diff
    static isAuthenticated(){ 
        let token = Authentication.getToken();
        if(token && token.token){
            return new Date().getTime() < token.created + token.expired;
        }else{
            alert(new Date());
            alert(token.created);
            alert(token.expired);
            return false;
        }   
    }

}