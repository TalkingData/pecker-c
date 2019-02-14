## QuickStart

### Development
安装VS Code + eggjs插件（在vscode 插件库中搜索eggjs，第一个就是）

```bash
git clone git@gitlab.tenddata.com:git/fa-monitor-services.git
cd fa-monitor-service
npm install
```

启动mongoDB
```bash
npm run startdb
```

在VS Code中打开代码
参考 https://github.com/eggjs/vscode-eggjs 进行开发调试[eggjs]: 
![](https://github.com/eggjs/vscode-eggjs/raw/master/snapshot/debugger.gif)


### Typegoose
model的定义我们用到了Typegoose，参考 https://github.com/szokodiakos/typegoose
Typegoose使用TS的注解将普通的TS类声明为mongoos的Model，这些类可以同时作为实体类（pojo）和 mongoos 的model使用。

### Deploy

```bash
$ npm run tsc
$ npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+
