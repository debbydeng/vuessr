import axios from 'axios';

export class Request {
    static get instance() {
        let instance = axios.create({
            baseURL:'http://localhost:3000/'
        });
        instance.interceptors.response.use(function (res) {
            return res.data
        });
        return instance;
    }

    static get(url, config = {}) {
        return this.instance.get(url, config)
    }

    static post(url, data, config = {}) {
        return this.instance.post(url, data, config)
    }
}
