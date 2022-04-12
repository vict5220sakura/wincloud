import Block from "./Block.js"
import BlockType from "./BlockType.js"
import RightMenuItem from "../RightMenu/RightMenuItem";
import CoordinateService from "../../service/CoordinateService.js";


export default class LinkBlock extends Block{
    url;
    name;
    constructor(vm, blockKey){
        super(vm, blockKey);
        this.blockType = BlockType.type_link;
    }
    getText(){
        return this.name;
    }
    getDefaultBackgroundImg(){
        return "/img/chrome.png"
    }
    getLazyBackgroundImg(){
        return this.url;
    }
    getRightMenuItemList(){
        let list = []
        list.push(RightMenuItem.newInstance(this.vm, "打开", (opts)=>{
            let url = this.url
            if (new RegExp("http.*").test(url)) {
                this.vm.openNewUrl(url)
            } else {
                this.vm.openNewUrl("http://" + url)
            }
        }))
        list.push(RightMenuItem.newInstance(this.vm, "修改", (opts)=>{
            this.vm.$prompt('请输入连接地址', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: this.url
            }).then((urlInputData) => {
                let urlInput = urlInputData.value;
                this.vm.$prompt('请输入标签名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: this.name
                }).then(async (nameInputData) => {
                    let nameInput = nameInputData.value

                    // 先删除 在新建
                    this.vm.tableService.removeBlock(this)
                    let linkBlock = await LinkBlock.newInstance(this.vm, nameInput, urlInput, this.blockKey)
                    linkBlock.setLeft(this.getLeft())
                    linkBlock.setTop(this.getTop())
                    this.vm.tableService.addBlock(linkBlock)

                    await this.vm.save();
                    this.vm.autoSaveNotify();
                })
            }).catch((e) => {console.log(e)});
        }))
        list.push(RightMenuItem.newInstance(this.vm, "删除", (opts)=>{
            this.vm.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                this.vm.tableService.removeBlock(this)
                // await this.save();
                // this.autoSaveNotify();
            }).catch((e) => {
                console.log(e)
            });
        }))
        list.push(RightMenuItem.newSendOtherTableMenuItem(this.vm));
        return list;
    }

    getMouseDoubleupFunc() {
        return ()=>{
            let url = this.url
            if (new RegExp("http.*").test(url)) {
                this.vm.openNewUrl(url)
            } else {
                this.vm.openNewUrl("http://" + url)
            }
        };
    }

    static async newInstance(vm, name, url, blockKey){
        let block = new this(vm, blockKey);
        block.name = name;
        block.url = url;
        await block.init();
        return block;
    }

    static async newInstanceJson(vm, json){
        return await LinkBlock.newInstance(vm, json["name"], json["url"], json["blockKey"])
    }
}