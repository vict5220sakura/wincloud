<template>
    <div>
        <div style="height: 300px;width: 250px;overflow: hidden; margin: 5px 5px 5px 5px" class="column main-end second-end">
            <div v-for="(item,index) in msgList" :key="index">{{item}}</div>
        </div>
        <div class="row">
            <el-input style="width: 200px" v-model="msg" @keyup.enter="sendMsg"></el-input>
            <el-button @click="sendMsg">发送</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "WsChat",
        data(){
            return{
                socket: null,
                msg: null,
                msgList: []
            }
        },
        props:{
            wsChatCode: {
                type: String,
                default: "001"
            }
        },
        created() {
            console.log("创建连接")
            this.socket = new WebSocket("wss://49.232.199.90/wschat?wsChatCode=" + this.wsChatCode);
            this.socket.onerror = err => {
                console.log(err);
            };
            this.socket.onopen = event => {
                console.log(event);
            };
            this.socket.onmessage = mess => {
                if(mess && mess.data){
                    this.msgList.push(mess.data)
                }
            };
            this.socket.onclose = () => {
                console.log("连接关闭");
            };
        },
        unmounted() {
            this.socket.close()
        },
        methods:{
            sendMsg(){
                let json = {msg: this.msg, wsChatCode: this.wsChatCode};
                this.socket.send(JSON.stringify(json))
                this.msg = null
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .row{
        display: flex;
        flex-direction: row;
    }
    .column{
        display: flex;
        flex-direction: column;
    }
    .main-center{
        justify-content:center
    }
    .main-end{
        justify-content:end
    }
    .main-around{
        justify-content:space-around;
    }
    .main-start{
        justify-content:start;
    }
    .second-center{
        align-items:center
    }
    .second-end{
        align-items:end
    }
</style>