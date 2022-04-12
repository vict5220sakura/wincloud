import { fabric } from 'fabric'
import { ajaxPrefilter } from 'jquery';
import BlockType from './bean/block/BlockType.js'
import XYUtil from '../../util/XYUtil.js'
import UrlUtil from "../../util/UrlUtil.js"
import { saveKey } from '../../common/M.js'
import Windows2MethonsRules from './Windows2MethonsRules.js'
import RightInit from './RightInit.js'
import LeftInit from './LeftInit.js'
import { login_mode, doubleClickTimeMillsseconds, createOrUpdate } from '../../common/M.js'
import LinkBlock from "./bean/block/LinkBlock";
import CoordinateService from "./service/CoordinateService.js"
import NodepadBlock from "./bean/block/NodepadBlock.js";
import TableBlock from "./bean/block/TableBlock.js"
import NowTable from "./bean/NowTable.js"
import TableSaveDao from "./dao/TableSaveDao.js"
import TableSaveData from "./entity/TableSaveData";
import ServerApi from "./serveApi/ServerApi.js"
import WsChat from "./WsChat";


export default {
    methods:{
        ...LeftInit, // 左键初始化
        ...RightInit, // 右键初始化
        ...Windows2MethonsRules,
        /** 自动保存提示 */
        autoSaveNotify(){
            this.notify("自动保存成功", "success")
        },
        notify(str, type, millseconds){
            if(type == 'success'){
                this.$notify({
                    message: '<i class="el-icon-success" style="color: green; margin-right: 6px"></i><span style="padding-botton: 4px">' + str + '</span>',
                    dangerouslyUseHTMLString: true,
                    showClose: false,
                    duration: millseconds || 1000,
                    customClass: "autoSaveNotifyClass"
                });
            }else if(type == 'error'){
                this.$notify({
                    message: '<i class="el-icon-error" style="color: red; margin-right: 6px"></i><span style="padding-botton: 4px">' + str + '</span>',
                    dangerouslyUseHTMLString: true,
                    showClose: false,
                    duration: millseconds || 1000,
                    customClass: "autoSaveNotifyClass"
                });
            }

        },
        /**
         * 右键新建连接菜单按下
         * @param opts
         */
        menuAddLinkMouseDown(opts){
            this.$prompt('请输入连接地址', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then((urlInputData) => {
                let urlInput = urlInputData.value;
                this.$prompt('请输入标签名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async (nameInputData) => {
                    let nameInput = nameInputData.value

                    let linkBlock = await LinkBlock.newInstance(this, nameInput, urlInput)
                    linkBlock.setLeft(this.rightMouseXTemp - (CoordinateService.blockWidth / 2 + CoordinateService.marginLeft))
                    linkBlock.setTop(this.rightMouseYTemp - (CoordinateService.blockHeight / 2 + CoordinateService.marginTop))
                    this.tableService.addBlock(linkBlock)
                    await this.save();
                    this.autoSaveNotify();
                })
            }).catch((e) => {console.log(e)});
        },
        async menuSaveMouseDown(opts){
            try{
                await this.save()
                this.notify("保存"+ (this.loginMode == login_mode.login_mode_local? "本地" : "远程" ) +"成功", "success")
            }catch(err){
                this.notify("保存失败! (请联系网站管理员arcueid5220@163.com)", "error", 3000)
                throw err;
            }
        },
        menuClearMouseDown(opts){
            this.$confirm('此操作将清空桌面数据', '清空', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableService.removeAllBlock(false)
                this.$message({
                    type: 'success',
                    message: '清空桌面数据成功!'
                });
            }).catch((e) => {console.log(e)});
        },

        /** 保存 */
        async save() {
            await TableSaveDao.saveInstance(this.tableService.nowTable, this.loginMode, this.username, this.password)
        },

        /**
         * 注册登录按钮点击
         */
        async btnLogin() {
            this.loginMode = login_mode.login_mode_serve
            this.$refs["loginForm"].validateField("username")
            this.$refs["loginForm"].validateField("password")
            if(!this.checkUsername().b || !this.checkPassword().b){
                return false;
            }
            // 注册登录
            let {b, msg, registLoginMode} = await ServerApi.registLogin(this.username, this.password)
            if(b){
                this.$message({
                    type: 'success',
                    message: (registLoginMode == "regist" ? "注册" : "登录") + '成功!'
                })
                // 登录成功
                // 桌面初始化 获取全部桌面菜单
                setTimeout(async ()=>{
                    await this.tableService.init(this.username, this.password)
                }, 0)

                this.$notify({
                    title: '提示',
                    message: "使用鼠标右键或长按屏幕呼出菜单",
                    duration: 0
                });

                this.loginDialogFlag = false;
            }else{
                this.$message({
                    type: 'error',
                    message: "用户名或密码错误"
                });
            }
        },
        /**
         * 本地登录按钮点击
         */
        async btnLocalLogin() {
            this.loginMode = login_mode.login_mode_local
            this.loginDialogFlag = false;
            let nowTable/**@type NowTable*/ = await TableSaveDao.loadInstance(this, null, this.loginMode)
            await this.tableService.load(nowTable);
        },

        /**
         * 打开当前窗口
         * @param key
         * @returns {Promise<void>}
         */
        async openTableKey(key/**@type String*/){
            let nowTable /**@type NowTable*/ = await TableSaveDao.loadInstance(this, key, this.loginMode, this.username, this.password)
            this.tableService.removeAllBlock(true);
            await this.tableService.load(nowTable);
        },
        openNewUrl(url){
            let newWin = window.open();
            newWin.location.href = url
            window.open(url)
        }
    }

    
}