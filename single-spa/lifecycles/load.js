import { LOADING_SOURCE_CODE, NOT_BOOTSTRAPED, NOT_LOADED } from "../application/app.helpers.js";

// 用户的bootstrap、mount、unmount可能是数组，数组中的函数按顺序执行。
function flattenArrayToPromise(fns) {
    fns = Array.isArray(fns) ? fns : [fns];
    return function (props) {
        // 这里Promise.resolve起手赋值给rPromise，then=》第一个fn执行， 第一个fn执行完后是新的rPromise
        return fns.reduce((rPromise, fn) => rPromise.then(() => fn(props)), Promise.resolve());
    }
}

export function toLoadPromise(app) {
    return Promise.resolve().then(() => {
        if (app.status !== NOT_LOADED) {
            // 此应用加载完毕
            return app;
        }
        app.status = LOADING_SOURCE_CODE; // 正在加载应用

        app.loadApp(app.customProps).then((v) => {
            const { bootstrap, mount, unmount } = v;
            app.status = NOT_BOOTSTRAPED;
            app.bootstrap = flattenArrayToPromise(bootstrap);
            app.mount = flattenArrayToPromise(mount);
            app.unmount = flattenArrayToPromise(unmount);
            return app;
        });
    });
}