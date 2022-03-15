import TableData from "./bean/table/TableData.js"
export default {
    data(){
        return {
            /**@type MyCanvasService */
            myCanvasService: null,
            /**@type RightMenuService */
            rightMenuService: null,
            /**@type NodepadService */
            nodepadService: null,
            /**@type TableBlockService*/
            tableBlockService: null,
            /**@type CoordinateService*/
            coordinateService: null,

            windowWidth: 1024, // 窗口宽
            windowHeight: 768, // 窗口高

            rightMouseXTemp: null, // 鼠标右键点击位置
            rightMouseYTemp: null, // 鼠标右键点击位置

            /**@type RightMenu*/
            tableRightMenu: null,

            // menuList: [], // 菜单列表
            // tablemenuItemBackgroundList: [], // 菜单项背景列表

            // allBlock: [], // 图标列表

            // linkBlockMenuBackground: null, // 链接菜单右键
            // linkBlockMenuList: [], // 链接菜单
            // linkBlockMenuItembackgroundList: [], // 链接菜单项背景列表

            loginDialogFlag: false, // 注册登录弹框
            username: null, // 用户名
            password: null, // 密码
            loginMode: null, // 登录模式

            nodepadFlag: false, // 记事本弹窗标记
            nodepadTitle: null,
            nodepadBody: null,

            // nodepadLeft: null,
            // nodepadTop: null,
            // nodepadCreateOrUpdate: null, // 记事本弹窗更新或创建
            // nodepadUpdateObj: null, // 记事本更新对象
            // nodepadBlockMenuBackground: null,
            // nodepadBlockMenuList: [], // 记事本菜单
            // nodepadBlockMenuItembackgroundList: [], // 记事本菜单项背景列表

            tableBlockEditFlag: false, // 桌面编辑弹窗
            // tableBlockMenuLeft: null,
            // tableBlockMenuRight: null,
            // tableBlockMenuName: null,
            // tableBlockMenuBackground: null,
            // tableBlockMenuList: [], // 桌面图标菜单
            // tableBlockMenuItembackgroundList: [], // 桌面图标菜单项背景列表


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