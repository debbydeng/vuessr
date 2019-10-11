import {createApp} from "./app";
import Vue from "vue";
const {app,router,store}=createApp();


// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}
router.onReady(()=>{
    app.$mount('#app');
});
