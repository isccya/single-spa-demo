import { getAppChanges } from "../application/app.helpers.js";
import { apps } from "../application/app.js";
import { toLoadPromise } from "../lifecycles/load.js";
import { toUnmountPromise } from "../lifecycles/unmount.js";
import { started } from "../start.js";

export function reroute() {
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
        return Promise.all(appsToLoad.map(toLoadPromise));
    }
    function performAppChange() {
        // 将不需要的应用卸载，返回一个卸载的promise
        const unmountPromises = Promise.all(appsToUnmount.map(toUnmountPromise));

        // 加载需要的应用（这个应用注册时候可能没加载） -> 启动对应的应用 -> 挂载对应的应用
        // 考虑手动加载情况：

        appsToLoad.map((app)=>toLoadPromise(app).then((app)=>{
            // 当应用加载完毕后需要启动和挂载，但需要先保证卸载完毕
            tryBootStrapAndMount(app,unmountPromises);
        }))
    }
}