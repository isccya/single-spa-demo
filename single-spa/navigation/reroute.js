import { getAppChanges } from "../application/app.helpers.js";

export function reroute(){
    // 获取app状态，进行分类
    const {appsToLoad, appsToMount, appsToUnmount} = getAppChanges();


    console.log(appsToLoad);
    
}