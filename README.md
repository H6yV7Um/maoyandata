# 猫眼院线数据爬取展示
基于create-react-app

## 开发调试

```js
// 本地开发
npm install
npm run start maoyan

// 路由配置，src/index.js

<Route path="/maoyandata" component={Maoyan} />
```

## mock数据
json-server在本地启动一个server做数据代理，默认端口是3000。
1. npm install -g json-server
2. 在mock下创建一个伪造数据的json文件，例：db.json
3. db.json装mock的数据，routes.json设置路由
4. 启动app: 

```js
npm run mock //代理本地
```