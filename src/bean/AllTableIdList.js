/**
 * 全部
 */
export default class AllTable{
    static AllTableLocalStorageKey = "djkashdijyqhihuakujhhdhkajhkjashdjkashd";

    /**@type String*/
    defaultKey = null;
    /**
     * @type String
     */
    childrenKeys = [];

    static localStorageGetInstance(){
        let str = localStorage.getItem(AllTable.AllTableLocalStorageKey);
        let allTable = str && (JSON.parse(str) || {})
    }
}