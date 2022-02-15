import { fabric } from 'fabric'

export default {
    data(){
      return {
        windowWidth: 1024,
        windowHeight: 768,
        canvas: null   
      } 
    },
    methods:{
        
    },
    created(){
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    },
    async mounted(){
        
      this.canvas = new fabric.Canvas("myCanvas")

      fabric.Image.fromURL('/img/img0_3840x2160.jpg', (oImg)=>{
        console.log(oImg)
        oImg.set({
          scaleX: this.windowWidth / oImg.width,
          scaleY: this.windowHeight / oImg.height
        })
        this.canvas.setBackgroundImage(oImg);
      });

      

      

      fabric.Image.fromURL('/img/green5050.png', (oImg)=>{
        this.canvas.add(oImg);
      });

      fabric.Image.fromURL('/img/red5050.png', (oImg)=>{
        this.canvas.add(oImg);
      });
      
    }
}