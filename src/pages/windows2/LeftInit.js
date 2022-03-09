export default{
    /** 左键事件注册 */
    leftClickRegist(){
        this.canvas.on('mouse:down', (options)=> {
            this.closeTableRightMenu(); // 关闭右键菜单
            this.linkBlockCloseMenu(); // 关闭图标视图菜单
        });
    },
}