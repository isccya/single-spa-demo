/**
 * 当前文件：
 * 
 * 统一对外暴露接口函数
 * */ 

export { registerApplication } from "./application/app.js"; // 根据路径加载应用
export { start } from "./start.js"; // 监控路径，开启应用并将其挂载