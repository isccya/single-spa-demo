import { getAppChanges, shouldBeAcitve } from "../application/app.helpers.js";
import { toBootstrapPromise } from "../lifecycles/bootstrap.js";
import { toLoadPromise } from "../lifecycles/load.js";
import { toMountPromise } from "../lifecycles/mount.js";
import { toUnmountPromise } from "../lifecycles/unmount.js";
import { started } from "../start.js";
import { callCaptureEventListeners, urlRoute } from "./navigation-event.js";

// 子应用路由监听hashchange、popstate触发urlroute事件，传入事件源event
export function reroute(event) {
    // 获取app状态，进行分类
    const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();



    // 先注册应用，应用注册完之后才会start。
    if (started) {
        // 用户调用了start方法，处理当前应用挂载卸载
        return performAppChange();
    }

    return loadApps();



    function loadApps() {
        // 根据需要加载的分类，加载对应的app
        return Promise.all(appsToLoad.map(toLoadPromise)).then(callEventListener);
    }

    function performAppChange() {
        // 将不需要的应用卸载，返回一个卸载的promise
        const unmountAllPromises = Promise.all(appsToUnmount.map(toUnmountPromise));

        // 加载需要的应用（这个应用注册时候可能没加载（因为只有路径对应的时候才会在注册的时候就加载）） -> 启动对应的应用 -> 挂载对应的应用
        const loadMountPromises = Promise.all(appsToLoad.map((app) => toLoadPromise(app).then(app => {
            return tryBootStrapAndMount(app, unmountAllPromises);
        })))

        const mountPromises = Promise.all(appsToMount.map(app => tryBootStrapAndMount(app,unmountAllPromises)));

        function tryBootStrapAndMount(app, unmountAllPromises) {
            if (shouldBeAcitve(app)) {
                // 启动 =》确保卸载完毕后 =》 挂载
                return toBootstrapPromise(app).then(app => unmountAllPromises.then(() => toMountPromise(app)))
            }
        }

        return Promise.all([loadMountPromises, mountPromises]).then(()=>{
            callEventListener();
        })
    }

    function callEventListener(){ // 调用子应用的路由监听方法
        callCaptureEventListeners(event);
    }
}