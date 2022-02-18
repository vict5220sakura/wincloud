export default class UriUtil{
    static getLogoUrl(urlAO){
        let url = urlAO;
        // https
        if(new RegExp("http.*").test(url)){
            
        }else{
            url = "https://" + url
        }

        // 获取标准域名
        let i = url.indexOf("/", 8)
        if(i == -1){
            url += "/favicon.ico"
        }else{
            url = url.substring(0, i)
            url += "/favicon.ico"
        }
        return url;
    }
}

// console.log(UriUtil.getLogoUrl("www.baidu.com/a/a"))