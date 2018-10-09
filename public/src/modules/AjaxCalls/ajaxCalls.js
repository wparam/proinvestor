export default class Http{
    static get(url, headers){
        let config = {
            method: 'GET',
            headers: Object.assign({
                'Content-Type': 'application/json',
            }, headers),
            credentials: 'same-origin'
        };
        return fetch(url, config).then((res) => {
            let ct = res.headers.get('content-type');
            if(res.status >= 200 && res.status < 300){
                let ret = ct.indexOf('application/json') >=0 ? res.json() : { loginSuccess: false, message: res.text() };
                return Promise.resolve(ret);
            }else{
                return Promise.reject(res);
            }
        });
    }
    static post(url, headers, body){
        let config = {
            method: 'POST',
            headers: Object.assign({
                'Content-Type': 'application/json'
            }, headers),
            credentials: 'same-origin',
            body: body
        };
        return fetch(url, config).then((res) => {
            let ct = res.headers.get('content-type');
            let content = null;
            if(ct && ct.indexOf('application/json') >=0) content = res.json();
            if(ct && ct.indexOf('content-type') >=0) content = { loginSuccess: false, message: res.text() };
            if(res.status >= 200 && res.status < 300) 
                return Promise.resolve(content);
            else{
                let err = new Error(res.statusText);
                if(res.status === 401 && res.headers.get('www-authenticate'))
                    err.message = res.headers.get('www-authenticate');
                return Promise.reject(err);
            }
        });
    }
}