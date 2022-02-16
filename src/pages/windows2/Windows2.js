import { fabric } from 'fabric'
import { ajaxPrefilter } from 'jquery';

export default {
    data(){
      return {
        windowWidth: 1024,
        windowHeight: 768,
        canvas: null, // 画布对象
        menuBackground: null, // 右键菜单背景
        menuAddLink: null // 添加连接
      } 
    },
    methods:{
        // 初始化鼠标右键菜单
        createdMenu(){
          this.menuBackground = new fabric.Rect({width: 100, height: 25, fill: '#eeeeee' });
          this.menuBackground.hasControls = false; 
          this.menuBackground.hasBorders = false;
          this.menuBackground.selectable = false;

          // 初始化新建连接菜单栏
          const addLinkText = new fabric.Text('新建连接', {
            fontSize: 15,
            fill: '#141414',
            top: 5,
            left: 5
          })
          const addLinkBackground = new fabric.Rect({width: 100, height: 25, fill: '#eeeeee'});
          addLinkBackground.hasControls = false; 
          addLinkBackground.hasBorders = false;
          addLinkBackground.selectable = false;
          this.menuAddLink = new fabric.Group([addLinkBackground, addLinkText], {})

          this.menuAddLink.hasControls = false; 
          this.menuAddLink.hasBorders = false;
          this.menuAddLink.selectable = false;
          this.menuAddLink.on('mouseover', (opts)=> {
            console.log('新建连接 悬停 opts=', opts);
            addLinkBackground.set("fill", '#ffffff')
            this.canvas.renderAll();
          });
          this.menuAddLink.on('mouseout', (opts)=> {
            addLinkBackground.set("fill", '#eeeeee')
            this.canvas.renderAll();
          });

          this.menuAddLink.on('mousedown', (opts)=> {
            console.log('新建连接 点击 opts=', opts);
            this.addLink()
          });
        },
        addLink(){
          this.$prompt('请输入连接地址', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            this.$message({
              type: 'success',
              message: '你的连接地址是: ' + value
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });       
          });
        }
    },
    created(){
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    },
    async mounted(){
      this.createdMenu();

      // 创建画布
      this.canvas = new fabric.Canvas("myCanvas")
      this.canvas.selection = false; // 禁止画布滑动选中
      this.canvas.hoverCursor = 'default' // 鼠标样式
      this.canvas.moveCursor = 'default' // 鼠标样式
      // 设置背景图片
      fabric.Image.fromURL('/img/img0_3840x2160.jpg', (oImg)=>{
        oImg.set({
          scaleX: this.windowWidth / oImg.width,
          scaleY: this.windowHeight / oImg.height
        })
        this.canvas.setBackgroundImage(oImg);
      });

      fabric.Image.fromURL('/img/green5050.png', (oImg)=>{
        oImg.hasControls = false; // 禁止大小控制
        oImg.hasBorders = false; // 禁止边框
        this.canvas.add(oImg);
      });

      fabric.Image.fromURL('/img/red5050.png', (oImg)=>{
        oImg.hasControls = false; // 禁止大小控制
        oImg.hasBorders = false; // 禁止边框
        this.canvas.add(oImg);
      });

      document.getElementsByClassName("upper-canvas")[0].oncontextmenu = (e)=>{
        console.log("鼠标右键e=", e)

        this.menuBackground.top = e.offsetY
        this.menuBackground.left = e.offsetX

        this.menuAddLink.top = e.offsetY
        this.menuAddLink.left = e.offsetX

        this.canvas.add(this.menuBackground);
        this.canvas.add(this.menuAddLink);
        e.preventDefault(); // 取消右键事件
      };

      this.canvas.on('mouse:down', (options)=> {
        console.log('mouse:down', options);
        // this.canvas.remove(this.menu);
      });
    }
}