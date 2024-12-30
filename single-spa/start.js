import { reroute } from "./navigation/reroute";

export let started = false; // 默认没有调用started方法


export function start(){
    started = true; // 用户启动了
    reroute();
}