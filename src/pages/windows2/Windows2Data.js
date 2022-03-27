export default {
    data(){
        return {
            /**@type MyCanvasService */
            myCanvasService: null,
            /**@type RightMenuService */
            rightMenuService: null,
            /**@type NodepadService */
            nodepadService: null,
            /**@type TableService*/
            tableService: null,
            /**@type CoordinateService*/
            coordinateService: null,
            /**@type TimeFrame*/
            timeFrame: null,

            windowWidth: 1024, // 窗口宽
            windowHeight: 768, // 窗口高

            rightMouseXTemp: null, // 鼠标右键点击位置
            rightMouseYTemp: null, // 鼠标右键点击位置

            rightCheckBlock: null, /**@type Block*/ // 右键选择block

            /**@type RightMenu*/
            tableRightMenu: null,

            loginDialogFlag: false, // 注册登录弹框
            username: null, // 用户名
            password: null, // 密码
            loginMode: null, // 登录模式

            nodepadFlag: false, // 记事本弹窗标记
            nodepadTitle: null,
            nodepadBody: null,

            tableBlockEditFlag: false, // 桌面编辑弹窗

            rules: {
                "username": [
                  {validator: (rule, value, callback) => {
                    let r = this.checkUsername();
                    if (!r.b) {
                      callback(r.msg)
                    }
                  }, trigger: 'change'}
                ],
                "password": [
                    {validator: (rule, value, callback) => {
                      let r = this.checkPassword();
                      if (!r.b) {
                        callback(r.msg)
                      }
                    }, trigger: 'change'}
                  ]
            }
        } 
    }
}