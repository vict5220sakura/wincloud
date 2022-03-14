import Block from "./Block.js"
import BlockType from "./BlockType.js"

export default class LinkBlock extends Block{
    url;
    name;
    getDefaultBackgroundImg(){
        return "/img/chrome.png"
    }
    constructor(vm){
        super(vm);
        this.blockType = BlockType.type_link;
    }

}