<template>
    <div class="red">Page 1
    <div class="title">{{item.id}}</div>
    </div>
</template>

<script>
    function createPerson(name,age,job){
        return {
            name,
            sayName(){
                console.log(this.name)
            }
        }
    }
    export default {
        name: "page1",
        asyncData({store,route}){
            return store.dispatch('fetchItem',1);
        },
        computed:{
            item(){
                return this.$store.state.items
            }
        },
        created(){
            const person=createPerson('wang')
            person.sayName();

            if('WebSocket' in Window){
                const ws=new WebSocket('ws://localhost:3000/connect');
                ws.onopen=()=>{
                    ws.send('发送数据')
                    console.log('发送数据中')
                }

                ws.onmessage=(e)=>{
                    const msg=e.data;
                    console.log('数据已接收')
                }

            }
        },


    }
</script>

<style scoped>
    @import './css/page1.scss';
    .red{
        color:red;
    }
</style>
