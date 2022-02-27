# winter-vue

>演示：http://118.31.52.244/index.html
>
>后端项目地址：https://github.com/zhanghao0827/winter

## 安装依赖
npm install

> 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题

npm install --registry=https://registry.npm.taobao.org

## 启动服务
npm run dev
>浏览器访问 [http://localhost:9528](http://localhost:9528)
>
>构建测试环境
>
>npm run build:stage
>
>构建生产环境
>
>npm run build:prod



## 提示

因为本项目是前后端完全分离的，所以需要前后端都单独启动好，才能进行访问。 

如果 npm install 报错，可以使用安装 **yarn** 

npm install -g yarn 

yarn config set registry https://registry.npm.taobao.org -g 

使用 yarn install 安装前端所需依赖



## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```





