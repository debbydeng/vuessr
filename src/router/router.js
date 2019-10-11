import Vue from 'vue'
import Router from 'vue-router'
import Page1 from '../pages/home/page1.vue';

Vue.use(Router)

export function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            {
                path: '/page1',
                component: Page1
            },
            {
                path: '/test',
                component: Page1
            },

        ]
    })
}
