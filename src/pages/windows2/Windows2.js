import { fabric } from 'fabric'
import { ajaxPrefilter } from 'jquery';

export default {
    data(){
      return {
        windowWidth: 1024,
        windowHeight: 768,
        canvas: null, // 画布对象
        menuBackground: null, // 右键菜单背景
        menuAddLink: null, // 添加连接
        urlBlockList: [] // 连接列表
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
        /** 添加连接图标 */
        addLink(){
          this.$prompt('请输入连接地址', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then((urlInputData) => {
            let urlInput = urlInputData.value;
            this.$prompt('请输入标签名称', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then((nameInputData) => {
              let nameInput = nameInputData.value

              let urlBlockText = new fabric.Textbox(nameInput, {
                // stroke: "red",
                // fill: "blue",
                fontFamily: "Inconsolata",
                width: 60,
                top: 10,
                left: 5,
                fontSize: 15,
                lineHeight: 1,
                textAlign: "left", // 文字对齐
                lockRotation: true, // 禁止旋转
                lockScalingY: true, // 禁止Y轴伸缩
                lockScalingFlip: true, // 禁止负值反转
                splitByGrapheme: true, // 拆分中文，可以实现自动换行
                objectCaching: false,
              });
  
              let urlBlockbackground = new fabric.Rect({
                width: 70, 
                height: 70, 
                fill: '#eeeeee' 
              });
              urlBlockbackground.hasControls = false; 
              urlBlockbackground.hasBorders = false;

              let urlBlock = new fabric.Group([urlBlockbackground, urlBlockText], {})
              urlBlock.hasControls = false; 
              urlBlock.hasBorders = false;
              urlBlock.url = urlInput
              this.urlBlockList.push(urlBlock);
              this.canvas.add(urlBlock);
              // 添加点击跳转事件
              urlBlock.on("mouseup", (opts)=>{
                console.log("连接点击", opts)
                let now = new Date().getTime();
                let oldTime = opts.target.time;
                opts.target.time = now;
                
                if(oldTime){
                  if(now - oldTime < 500){
                    let url = opts.target.url
                    if(new RegExp("http.*").test(url)){
                      window.open(url)
                    }else{
                      window.open("http://" + url)
                    }
                  }
                }
              })
            })
          }).catch(() => {});
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
        this.canvas.renderAll();
      });

      // 右键事件
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
        this.canvas.remove(this.menuBackground);
        this.canvas.remove(this.menuAddLink);
      });
    }
}