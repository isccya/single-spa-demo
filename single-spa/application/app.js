/**
 * 当前文件：
 * 
 * 1. 管理子应用注册
 * 
 * 
 * 2. 每注册一个应用调用一次reroute，判断当前应用是被加载挂载or卸载。
 * 
 * 
 * */ 

import { reroute } from "../navigation/reroute.js";
import { NOT_LOADED } from "./app.helpers.js";

export const apps = []; // 所有注册的应用

export function registerApplication(appName, loadApp, activeWhen, customProps) { // 创建一个注册的应用
    const registeration = { // 当前注册的应用
        name:appName,
        loadApp,
        activeWhen,
        customProps,
        status:NOT_LOADED,
    }
    apps.push(registeration);

    // 每个应用需要有对应的状态

    // 未加载 =》加载 =》挂载 =》卸载 

    // 需要检测哪些应用要被加载 =》 被挂载，哪些应用要卸载
    // 每注册一次应用registerApplication就调用一次reroute
    reroute();
}