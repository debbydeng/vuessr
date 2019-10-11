import Vue from 'vue'
import App from './App.vue'
import {createRouter} from "./src/router/router";
import {createStore} from "./src/store/index"
import {sync} from 'vuex-router-sync'
export function createApp(){
    const router=createRouter();
    const store=createStore();
    sync(store,router);
    Vue.mixin({
        beforeMount () {
            const { asyncData } = this.$options
            if (asyncData) {
                // 将获取数据操作分配给 promise
                // 以便在组件中，我们可以在数据准备就绪后
                // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
                this.dataPromise = asyncData({
                    store: this.$store,
                    route: this.$route
                })
            }
        }
    })
    const app= new Vue({
        router,
        store,
        render:h=>h(App)
    });
    return {app,router,store}
}
