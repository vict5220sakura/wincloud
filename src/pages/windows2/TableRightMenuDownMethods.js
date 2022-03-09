import LinkBlock from "./bean/LinkBlock";
import { login_mode } from '@/common/M.js'

/**
 * 菜单按下方法
 */
export default {
    /**
     * 右键新建连接菜单按下
     * @param opts
     */
    menuAddLinkMouseDown(opts){
        console.log('新建连接 点击 opts=', opts);

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

                let linkBlock = new LinkBlock();
                linkBlock.url = urlInput
                linkBlock.name = nameInput;

                linkBlock.left = opts.pointer.x
                linkBlock.top = opts.pointer.y
                await this.addLinkBlock(linkBlock);
                this.blockAutoArrange();
                await this.save();
                this.autoSaveNotify();
            })
        }).catch(() => { });
    },
    async menuSaveMouseDown(opts){
        console.log('保存 点击 opts=', opts);
        try{
            await this.save()
            this.notify("保存"+ (this.loginMode == login_mode.login_mode_local? "本地" : "远程" ) +"成功", "success")
        }catch(err){
            this.notify("保存失败! (请联系网站管理员arcueid5220@163.com)", "error")
        }
    },
    menuClearMouseDown(opts){
        console.log('清空 点击 opts=', opts);

        this.$confirm('此操作将清空桌面数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.removeAllBlock()
            this.$message({
                type: 'success',
                message: '清空桌面数据成功!'
            });
        }).catch(() => {

        });
    },
    async menuAutopailieMouseDown(opts){
        this.blockAutoArrange();
        await this.save();
        this.autoSaveNotify();
    },
    menuAddNodepadMouseDown(opts){
    }

}