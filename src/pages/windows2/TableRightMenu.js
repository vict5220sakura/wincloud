import {fabric} from "fabric";

export default{
    /** 桌面右键菜单初始化 */
    tableRightMenuInit() {
        this.menuBackground = new fabric.Rect({ width: 100, height: 125, fill: '#eeeeee' });
        this.menuBackground.hasControls = false;
        this.menuBackground.hasBorders = false;
        this.menuBackground.selectable = false;
        this.tableRightMenuInitLink();
        this.tableRightMenuInitSave();
        this.tableRightMenuInitClear();
        this.tableRightMenuInitAutopailie();
        this.tableRightMenuInitAddNodepad();
    },

    /** 展示桌面右键菜单 */
    showTableRightMenu(x, y) {
        this.canvas.discardActiveObject(); // 取消所有对象选中状态
        this.closeAllBlockMenu();
        this.menuBackground.top = y
        this.menuBackground.left = x

        this.canvas.add(this.menuBackground);
        let topIndex = 0
        for (let menuItem of this.menuList) {
            menuItem.top = y + (menuItem.height * topIndex)
            menuItem.left = x
            this.canvas.add(menuItem);
            topIndex++;
        }
    },
    /** 关闭桌面右键菜单 */
    closeTableRightMenu() {

        this.canvas.remove(this.menuBackground);

        for (let menuItem of this.menuList) {
            this.canvas.remove(menuItem);
        }

        for(let backgroud of this.tablemenuItemBackgroundList){
            backgroud.set("fill", '#eeeeee')
        }
        this.canvas.renderAll();
    },


    /** 添加清空菜单 */
    tableRightMenuInitClear() {
        const text = new fabric.Text('清空', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
        })
        const background = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        this.tablemenuItemBackgroundList.push(background)
        background.hasControls = false;
        background.hasBorders = false;
        background.selectable = false;

        let menuItem = new fabric.Group([background, text], {})

        menuItem.hasControls = false;
        menuItem.hasBorders = false;
        menuItem.selectable = false;
        menuItem.on('mouseover', (opts) => {
            console.log('清空 悬停 opts=', opts);
            background.set("fill", '#ffffff')
            this.canvas.renderAll();
        });
        menuItem.on('mouseout', (opts) => {
            background.set("fill", '#eeeeee')
            this.canvas.renderAll();
        });

        menuItem.on('mousedown', (opts) => {
            this.menuClearMouseDown(opts);
        });

        this.menuList.push(menuItem)
    },

    /** 添加保存菜单 */
    tableRightMenuInitSave() {
        // 初始化新建连接菜单栏
        const text = new fabric.Text('保存', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
        })
        const background = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        this.tablemenuItemBackgroundList.push(background)
        background.hasControls = false;
        background.hasBorders = false;
        background.selectable = false;

        let menuItem = new fabric.Group([background, text], {})

        menuItem.hasControls = false;
        menuItem.hasBorders = false;
        menuItem.selectable = false;
        menuItem.on('mouseover', (opts) => {
            console.log('保存 悬停 opts=', opts);
            background.set("fill", '#ffffff')
            this.canvas.renderAll();
        });
        menuItem.on('mouseout', (opts) => {
            background.set("fill", '#eeeeee')
            this.canvas.renderAll();
        });

        menuItem.on('mousedown', async (opts) => {
            await this.menuSaveMouseDown(opts);
        });

        this.menuList.push(menuItem)
    },
    /** 添加自动排列菜单 */
    tableRightMenuInitAutopailie() {
        const text = new fabric.Text('刷新排列', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
        })
        const background = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        this.tablemenuItemBackgroundList.push(background)
        background.hasControls = false;
        background.hasBorders = false;
        background.selectable = false;

        let menuItem = new fabric.Group([background, text], {})

        menuItem.hasControls = false;
        menuItem.hasBorders = false;
        menuItem.selectable = false;
        menuItem.on('mouseover', (opts) => {
            background.set("fill", '#ffffff')
            this.canvas.renderAll();
        });
        menuItem.on('mouseout', (opts) => {
            background.set("fill", '#eeeeee')
            this.canvas.renderAll();
        });

        menuItem.on('mousedown', async (opts) => {
            this.menuAutopailieMouseDown(opts)
        });

        this.menuList.push(menuItem)
    },
    /**
     * 初始化新建记事本链接
     */
    tableRightMenuInitAddNodepad(){
        const text = new fabric.Text('新建记事本', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
        })
        const background = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        this.tablemenuItemBackgroundList.push(background)
        background.hasControls = false;
        background.hasBorders = false;
        background.selectable = false;

        let menuItem = new fabric.Group([background, text], {})

        menuItem.hasControls = false;
        menuItem.hasBorders = false;
        menuItem.selectable = false;
        menuItem.on('mouseover', (opts) => {
            background.set("fill", '#ffffff')
            this.canvas.renderAll();
        });
        menuItem.on('mouseout', (opts) => {
            background.set("fill", '#eeeeee')
            this.canvas.renderAll();
        });

        menuItem.on('mousedown', async (opts) => {
            this.menuAddNodepadMouseDown(opts)
        });

        this.menuList.push(menuItem)
    },
    /** 桌面右键菜单 */
    tableRightMenuInitLink() {
        // 初始化新建连接菜单栏
        const addLinkText = new fabric.Text('新建连接', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
        })
        const background = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
        this.tablemenuItemBackgroundList.push(background)
        background.hasControls = false;
        background.hasBorders = false;
        background.selectable = false;

        let menuAddLink = new fabric.Group([background, addLinkText], {})

        menuAddLink.hasControls = false;
        menuAddLink.hasBorders = false;
        menuAddLink.selectable = false;
        menuAddLink.on('mouseover', (opts) => {
            console.log('新建连接 悬停 opts=', opts);
            background.set("fill", '#ffffff')
            this.canvas.renderAll();
        });
        menuAddLink.on('mouseout', (opts) => {
            background.set("fill", '#eeeeee')
            this.canvas.renderAll();
        });

        menuAddLink.on('mousedown', (opts) => {
            this.menuAddLinkMouseDown(opts);
        });

        this.menuList.push(menuAddLink)
    },
}