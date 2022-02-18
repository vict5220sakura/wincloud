import axios from 'axios'
import {domain} from '@/common/M.js'

export default class Api{
    static async post(type, data){
        let params = {}
        params.apiReq = {};
        params.apiReq.apiType = type;
        params.apiReq.data = data
        return await new Promise((r,c)=>{
            axios({
                url:domain,
                method:'post',
                data: params,
                contentType: "application/json; charset=UTF-8"
            }).then((res)=>{
                r(res.data);
            }).catch((err)=>{
                c(err)
            })
        })
    }
}