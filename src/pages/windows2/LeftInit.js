export default{
    /** 左键事件注册 */
    leftClickRegist(){
        this.canvas.on('mouse:down', (options)=> {
            this.closeAllBlockMenu();
        });
    },
}