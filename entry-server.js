import {createApp} from './app';

export default context => {
    return new Promise((resolve, reject) => {
        const {app, router, store} = createApp();
        if (context.url) {
            router.push(context.url);
        }

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();

            if (!matchedComponents.length) {
                return reject({code: 404})
            }
            Promise.all(matchedComponents.map(Component => {
                if (Component.asyncData) {
                    return Component.asyncData({
                        store,
                        route: router.currentRoute
                    })
                }
            })).then(() => {
                // 在所有预取钩子(preFetch hook) resolve 后，
                // 我们的 store 现在已经填充入渲染应用程序所需的状态。
                // 当我们将状态附加到上下文，
                // 并且 `template` 选项用于 renderer 时，
                // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
                console.log(store.state,`${Date.now()}------ms`)
                context.state = store.state
                resolve(app)


            }).catch(reject)
          //  resolve(app)

        },reject)
    })


}





