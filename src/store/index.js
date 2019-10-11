import Vue from 'vue';
import Vuex from 'vuex';
import {fetchItem} from "../api/page1";

Vue.use(Vuex);

export function createStore() {
    return new Vuex.Store({
        state: {
            items: {}
        },
        actions: {
            fetchItem({commit}, id) {
                return fetchItem({id}).then(item => {
                    commit('setItem', {id, item})
                })
            }
        },
        mutations: {
            setItem(state, {id, item}) {
                Vue.set(state.items, 'id', item)
            }
        }
    })
}

