// 对浏览器路径切换进行劫持，劫持后重新调用reroute方法

import { reroute } from "./reroute.js";

export function urlRoute(){
    reroute(arguments);
}


window.addEventListener('hashchange',urlRoute);
window.addEventListener('popstate',urlRoute);