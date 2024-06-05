import axios from 'axios';
import { getToken } from './token';
class RequestManager {
   
    public async getRequestManger() {
        const requestman = axios.create();        
        const access_token = await getToken()
        requestman.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        requestman.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
        requestman.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        return requestman;
    }

}
export  default  new RequestManager().getRequestManger;