// import {fabric} from "fabric";
// import BlockType from "./bean/block/BlockType";
//
// /** 记事本右键菜单 */
// export default{
//     /** 链接图标右键菜单初始化 */
//     nodepadBlockMenuInit() {
//         // 菜单背景初始化
//         this.nodepadBlockMenuBackground = new fabric.Rect({ width: 100, height: 50, fill: '#eeeeee' });
//         this.nodepadBlockMenuBackground.hasControls = false;
//         this.nodepadBlockMenuBackground.hasBorders = false;
//         this.nodepadBlockMenuBackground.selectable = false;
//
//         this.nodepadBlockMenuXiugaiInit();
//         this.nodepadBlockMenuDeleteInit();
//     },
//     nodepadBlockMenuXiugaiInit(){
//         // 添加修改按钮
//         let updateItemText = new fabric.Text('修改', {
//             fontSize: 15,
//             fill: '#141414',
//             top: 5,
//             left: 5
//         })
//
//         let updateItemBackground = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
//         this.nodepadBlockMenuItembackgroundList.push(updateItemBackground);
//         updateItemBackground.hasControls = false;
//         updateItemBackground.hasBorders = false;
//         updateItemBackground.selectable = false;
//
//         let updateItem = new fabric.Group([updateItemBackground, updateItemText], {})
//         updateItem.hasControls = false;
//         updateItem.hasBorders = false;
//         updateItem.selectable = false;
//         updateItem.on('mouseover', (opts) => {
//             updateItemBackground.set("fill", '#ffffff')
//             this.canvas.renderAll();
//         });
//         updateItem.on('mouseout', (opts) => {
//             updateItemBackground.set("fill", '#eeeeee')
//             this.canvas.renderAll();
//         });
//         updateItem.on('mousedown', (opts) => {
//             let x = this.rightMouseXTemp
//             let y = this.rightMouseYTemp
//
//             let updateObj;
//             let objs = this.fabricChooseObjs(x, y)
//             for (let obj of objs) {
//                 if (obj.block.blockType == BlockType.type_nodepad) {
//                     updateObj = obj
//                     break
//                 }
//             }
//             this.showNodepadUpdate(updateObj)
//         });
//
//         this.nodepadBlockMenuList.push(updateItem)
//     },
//     nodepadBlockMenuDeleteInit(){
//         // 添加删除按钮
//         let itemText = new fabric.Text('删除', {
//             fontSize: 15,
//             fill: '#141414',
//             top: 5,
//             left: 5
//         })
//
//         let itemBackground = new fabric.Rect({ width: 100, height: 25, fill: '#eeeeee' });
//         this.nodepadBlockMenuItembackgroundList.push(itemBackground);
//         itemBackground.hasControls = false;
//         itemBackground.hasBorders = false;
//         itemBackground.selectable = false;
//
//         let item = new fabric.Group([itemBackground, itemText], {})
//         item.hasControls = false;
//         item.hasBorders = false;
//         item.selectable = false;
//         item.on('mouseover', (opts) => {
//             itemBackground.set("fill", '#ffffff')
//             this.canvas.renderAll();
//         });
//         item.on('mouseout', (opts) => {
//             itemBackground.set("fill", '#eeeeee')
//             this.canvas.renderAll();
//         });
//         item.on('mousedown', (opts) => {
//             console.log("选中删除", opts)
//             this.$confirm('是否删除?', '提示', {
//                 confirmButtonText: '确定',
//                 cancelButtonText: '取消',
//                 type: 'warning'
//             }).then(async () => {
//                 let y = this.nodepadBlockMenuBackground.top
//                 let x = this.nodepadBlockMenuBackground.left
//                 let objs = this.fabricChooseObjs(x, y)
//                 for (let obj of objs) {
//                     if (obj.block.blockType == BlockType.type_nodepad) {
//                         this.removOneBlock(obj)
//                         break
//                     }
//                 }
//                 await this.save();
//                 this.autoSaveNotify();
//             }).catch((e) => {
//                 console.log(e)
//             });
//
//         });
//
//         this.nodepadBlockMenuList.push(item)
//     },
//     /** 展示菜单 */
//     nodepadBlockShowMenu(chooseObj, block, x, y) {
//         this.nodepadBlockMenuBackground.top = y
//         this.nodepadBlockMenuBackground.left = x
//
//         this.canvas.discardActiveObject(); // 取消所有对象选中状态
//         // this.closeAllBlockMenu();
//
//         this.canvas.add(this.nodepadBlockMenuBackground);
//         let topIndex = 0
//         for (let menuItem of this.nodepadBlockMenuList) {
//             menuItem.top = y + (menuItem.height * topIndex)
//             menuItem.left = x
//             this.canvas.add(menuItem);
//             topIndex++;
//         }
//     },
//     /** 关闭菜单 */
//     nodepadBlockCloseMenu() {
//         this.canvas.remove(this.nodepadBlockMenuBackground);
//         for (let menuItem of this.nodepadBlockMenuList) {
//             this.canvas.remove(menuItem);
//         }
//         for(let item of this.nodepadBlockMenuItembackgroundList){
//             item.set("fill", '#eeeeee')
//         }
//         this.canvas.renderAll();
//     },
// }