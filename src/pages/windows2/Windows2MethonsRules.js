export default {
    /**
     * 用户名校验
     */
    checkUsername(){
        if(!this.username){
            return {b: false, msg: "请输入用户名"}
        }
        if(!this.username.trim() || this.username.trim() == ""){
            return {b: false, msg: "请输入用户名"}
        }
        if(!new RegExp("^[a-zA-Z0-9]+$").test(this.username.trim())){
            return {b: false, msg: "用户名只允许输入英文及数字"}
        }
        if(this.username.trim().length > 30){
            return {b: false, msg: "用户名只允许不超过30个字符"}
        }
        if(this.username.trim().length < 6){
            return {b: false, msg: "用户名至少6个字符"}
        }
        return {b: true}
    },
    /**
     * 密码校验
     */
    checkPassword(){
        if(!this.password){
            return {b: false, msg: "请输入密码"}
        }
        if(!this.password.trim() || this.password.trim() == ""){
            return {b: false, msg: "请输入密码"}
        }
        if(!new RegExp("^[a-zA-Z0-9\.\/,]+$").test(this.password.trim())){
            return {b: false, msg: "密码只允许输入英文及数字及(,./)"}
        }
        if(this.password.trim().length > 30){
            return {b: false, msg: "密码只允许不超过30个字符"}
        }
        if(this.password.trim().length < 6){
            return {b: false, msg: "密码至少6个字符"}
        }
        return {b: true}
    }
    
}