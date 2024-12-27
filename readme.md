# single-spa微前端框架
## 基础
- 核心两个函数，registerApplication和start，在single-spa.js中对外暴露。
## registerApplication
1. app.js中暴露此方法，接受应用注册的数据，所有子应用统一放到apps；
每注册一个应用，调用一次reroute方法。
2. app.helpers.js中定义了子应用的状态，并根据状态判断子应用是要被 加载、挂载或卸载。
3. 在reroute.js中，调用app.helpers.js的判断方法，给子应用分类（要被加载的、挂载的、卸载的）。
## start