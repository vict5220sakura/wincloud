import Api from '@/util/Api.js'

/**登录service */
export default class LoginService{
    /**
     * 注册 登录
     * username password
     * return {boolean, msg}
     */
    static async registLogin(username, password){
        let data = await Api.post("registLogin", {username, password})
        return data;
    }
    
}