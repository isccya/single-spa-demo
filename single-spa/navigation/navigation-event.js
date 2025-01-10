// 对浏览器路径切换进行劫持，劫持后重新调用reroute方法

import { reroute } from "./reroute.js";

export function urlRoute() {
    reroute(arguments);
}


window.addEventListener('hashchange', urlRoute);
window.addEventListener('popstate', urlRoute);

const capturedEventListeners = {
    hashchange: [],
    popstate: [],
}

// 子应用也会有监听路由，要先挂载应用（可能是异步挂载）后再去加载子应用的路由
const listeningTo = ['hashchange','popstate'];
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

window.addEventListener = function (eventName, callback) {
    if(listeningTo.includes(eventName) && !capturedEventListeners[eventName].some(listener => listener === callback)){
        return  capturedEventListeners[eventName].push(callback);
    }
    return originalAddEventListener.apply(this,arguments); // 调用原来的方法
}

window.removeEventListener = function (eventName, callback) {
    if(listeningTo.includes(eventName)){
        return capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(fn => fn !== callback)
    }
    return originalRemoveEventListener.apply(this,arguments);
}

export function callCaptureEventListeners(e){
    if(e){
        const eventType = e[0].type;
        if(listeningTo.includes(eventType)){
            capturedEventListeners[eventType].forEach((listener)=>{
                listener.apply(this,e);
            })
        }
    }
    
}