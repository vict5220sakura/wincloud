export default class Jiami2{
    static jiami(str){
        let jiamiStr = new Buffer(str, "utf-8").toString('base64')
        let arr = []
        for(let i = 0; i < jiamiStr.length; i+=3){
            let item = jiamiStr.substring(i, i+3)
            arr.push(item);
        }
        let l = arr[arr.length - 1].length
        arr.reverse();
        let a = arr.join("");
        let jiami = l+a;
        return jiami;
    }

    static jiemi(jiamiStr){
        if(jiamiStr == undefined){
            return undefined;
        }
        if(jiamiStr == null){
            return null;
        }
        let l = jiamiStr.substring(0, 1)
        let Jiami = jiamiStr.substring(1, jiamiStr.length)
        let arr = []
        arr.push(Jiami.substring(0, Number(l)))
        for(let i = Number(l); i < Jiami.length; i+=3){
            let item = Jiami.substring(i, i+3)
            arr.push(item);
        }
        arr.reverse();
        let jiemi = arr.join("");

        let jiemiStr = new Buffer(jiemi, "base64").toString('utf-8')
        return jiemiStr;
    }
}
