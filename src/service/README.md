## QuickStart

### Development

安装 VS Code + eggjs 插件

```bash
npm install
```

启动 mongoDB

```bash
npm run start:db
```

在 VS Code 中打开代码
参考 https://github.com/eggjs/vscode-eggjs 进行开发调试[eggjs]:
![](https://github.com/eggjs/vscode-eggjs/raw/master/snapshot/debugger.gif)

### Typegoose

model 的定义我们用到了 Typegoose，参考 https://github.com/szokodiakos/typegoose
Typegoose 使用 TS 的注解将普通的 TS 类声明为 mongoos 的 Model，这些类可以同时作为实体类（pojo）和 mongoos 的 model 使用。

### Deploy

```bash
$ npm run tsc && npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+
