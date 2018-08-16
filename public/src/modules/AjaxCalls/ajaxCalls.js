export default class Http{
    static get(url, headers, body){
        let config = {
                        method: 'GET',
                        headers: Object.assign({
                            'Content-Type': 'application/json',
                        }, headers),
                        credentials: 'same-origin',
                        
                    };
        if(body){
            config.body = body;
        }
        return fetch(url, config).then((res) => {
            return res.json();
        });
    }
    static post(url, headers, body){
        let config = {
                        method: 'POST',
                        headers: Object.assign({
                            'Content-Type': 'application/json',
                        }, headers),
                        credentials: 'same-origin',
                        body: body
                    };
        return fetch(url, config).then((res) => {
            return res.json();
        });
    }
}