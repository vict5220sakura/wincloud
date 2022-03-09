export default {
    data(){
        return {
            windowWidth: 1024,
            windowHeight: 768,
            table: null,
            canvas: null, // 画布对象
            menuBackground: null, // 右键菜单背景

            menuList: [], // 菜单列表
            tablemenuItemBackgroundList: [], // 菜单项背景列表

            allBlock: [], // 图标列表

            linkBlockMenuBackground: null, // 链接菜单右键
            linkBlockMenuList: [], // 链接菜单
            linkBlockMenuItembackgroundList: [], // 链接菜单项背景列表

            loginDialogFlag: false, // 注册登录弹框
            username: null, // 用户名
            password: null, // 密码
            loginMode: null, // 登录模式
            winDataStr: null,

            nodepadFlag: false, // 记事本弹窗标记
            nodepadLeft: null,
            nodepadTop: null,
            nodepadTitle: null,
            nodepadBody: null,
            nodepadCreateOrUpdate: null, // 记事本弹窗更新或创建
            nodepadUpdateObj: null, // 记事本更新对象
            nodepadBlockMenuBackground: null,
            nodepadBlockMenuList: [], // 记事本菜单
            nodepadBlockMenuItembackgroundList: [], // 记事本菜单项背景列表

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