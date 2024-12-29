import { getAppChanges } from "../application/app.helpers.js";
import { apps } from "../application/app.js";
import { toLoadPromise } from "../lifecycles/load.js";

export function reroute() {
    // 获取app状态，进行分类
    const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();


    // 根据需要加载的分类，加载对应的app
    return loadApps();

    function loadApps() {
        return Promise.all(appsToLoad.map(app => toLoadPromise(app)));
    }
}