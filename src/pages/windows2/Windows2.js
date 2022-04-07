import { fabric } from 'fabric'
import { ajaxPrefilter } from 'jquery';
import BlockType from './bean/block/BlockType.js'
import LinkBlock from "./bean/block/LinkBlock.js"
import XYUtil from '@/util/XYUtil.js'
import UrlUtil from "@/util/UrlUtil.js"
import WindowsData from './Windows2Data.js'
import {saveKey} from '@/common/M.js'
import Windows2Methods from './Windows2Methods.js'
import MyCanvasService from "./service/MyCanvasService.js"
import RightMenuService from "./service/RightMenuService.js";
import RightMenu from "./bean/RightMenu/RightMenu.js";
import NodepadService from "./service/NodepadService.js";
import TableService from "./service/TableService.js";
import CoordinateService from "./service/CoordinateService.js";
import TimeFrame from "./frame/TimeFrame";
import WsChat from "./WsChat";


export default {
    mixins: [WindowsData, Windows2Methods],
    components:{WsChat},
    created(){
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        // fabric.Object.prototype.objectCaching = false;
    },
    async mounted(){
        this.myCanvasService = new MyCanvasService(this);
        this.rightMenuService = new RightMenuService(this);
        this.nodepadService = new NodepadService(this);
        this.tableService = new TableService(this);
        this.coordinateService = new CoordinateService(this);
        this.timeFrame = new TimeFrame(this);

        this.tableRightMenu = new RightMenu(this);
        this.tableRightMenu.addRightMenuItem("新建连接", (opts)=>{
            this.menuAddLinkMouseDown(opts);
        })
        this.tableRightMenu.addRightMenuItem("保存", async (opts)=>{
            await this.menuSaveMouseDown(opts);
        })
        this.tableRightMenu.addRightMenuItem("清空", (opts)=>{
            this.menuClearMouseDown(opts);
        })
        this.tableRightMenu.addRightMenuItem("刷新排列", (opts)=>{
            this.coordinateService.reset()
        })
        this.tableRightMenu.addRightMenuItem("新建记事本", async (opts)=>{
            await this.nodepadService.showNodepad()
        })
        this.tableRightMenu.addRightMenuItem("新建桌面", (opts)=>{
            this.tableService.menuAddTableMouseDown();
        })
        this.tableRightMenu.addRightMenuItem("新建聊天室", (opts)=>{
            this.tableService.menuAddWsChatMouseDown();
        })

        // 右键事件注册
        this.rightClickRegist();
        // 左键事件注册
        this.leftClickRegist();

        // 登录弹窗默认显示
        this.loginDialogFlag = true;
    }
}