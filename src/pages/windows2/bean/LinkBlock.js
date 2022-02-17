import Block from "./Block.js"
import BlockType from "./BlockType.js"

export default class LinkBlock extends Block{
    url;
    name;
    constructor(){
        super();
        this.blockType = BlockType.type_link;
    }
}