/**
 * 当前文件：
 * 1. 定义子应用的状态。
 * 
 * 2. 根据子应用的状态判断其属于哪一个：appsToLoad需要被加载，appsToMounted需要被挂载，appsToUnmounted需要被卸载。
 * 
 * */ 

import { apps } from "./app.js"

export const NOT_LOADED = 'NOT_LOADED' // 没有被加载
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE' // 路径匹配了，要去加载资源
export const LOAD_ERROR = 'LOAD_ERROR' // 加载失败

// 启动过程
export const NOT_BOOTSTRAPED = 'NOT_BOOTSTRAPED' // 资源加载完毕，需要启动但还没启动
export const BOOTSTRAPING = 'BOOTSTRAPING' // 启动中
export const NOT_MOUNTED = 'NOT_MOUNTED' // 启动完毕，未被挂载

// 挂载流程
export const MOUNTING = 'MOUNTING' // 正在挂载 
export const MOUNTED = 'MOUNTED' //  挂载完成

// 卸载流程
export const UNMOUNTING = 'UNMOUNTING' // 卸载中


// 当前应用是否已激活
export function isActive(app) {
    return app.status == MOUNTED;
}

// 当前应用是否需要被激活
export function shouldBeAcitve(app) {    
    return app.activeWhen(window.location);
}

// 获取哪些应用要被加载、哪些应用被挂载、哪些应用被卸载。
export function getAppChanges() {
    const appsToLoad = []
    const appsToMount = []
    const appsToUnmount = []
    apps.forEach((app) => {
        let appShouldBeActive = shouldBeAcitve(app);        
        switch (app.status) {
            // 当前路径下，哪些应用需要被加载
            case NOT_LOADED:
            case LOADING_SOURCE_CODE:
                if (appShouldBeActive) {
                    appsToLoad.push(app);
                }
                break;
            // 当前路径下，哪些应用需要被挂载
            case NOT_BOOTSTRAPED:
            case BOOTSTRAPING:
            case NOT_MOUNTED:
                if (appShouldBeActive) {
                    appsToMount.push(app);
                }
                break;
            // 当前路径下，哪些应用需要被卸载
            case MOUNTED:
                if (!appShouldBeActive) {
                    appsToUnmount.push(app);
                }
                break;
            default:
                break;
        }
    })
    return {appsToLoad,appsToMount,appsToUnmount}
}