## 一. 前言

1. 支持对angular和vue项目的错误监控，并且实时上报。
2. 上报错误类型包括JS语法错误，网络请求错误，静态资源加载错误。

## 二. 参数

| 参数      | 类型   | 说明                                              | 是否必传 |
| --------- | ------ | ------------------------------------------------- | -------- |
| appkey    | string | 错误信息上报唯一标识                              | 是       |
| uploadUrl | string | 错误信息上报地址                                  | 是       |
| disable   | number | 错误信息是否上报标识，1为上报，0为不上报，默认为1 | 否       |

## 三.安装
```
npm install pecker-c
```
## 四.集成
### 1.Angular
```
import {ErrorHandler } from '@angular/core';
    
import YZMonitor  from 'pecker-c';
YZMonitor.config = { 
    appkey : 'xxxxx',
    disable : xx,
    uploadurl : 'http://xxxx'
}
    
export class YZMonitorErrorHandler implements ErrorHandler{
    handleError(error:any){
        YZMonitor.notify(error);
    }
}
    
@NgModule({
  providers: [{provide: ErrorHandler, useClass: YZMonitorErrorHandler}]
})
```

### 2.Vue
```
    import YZMonitor from 'pecker-c'
    YZMonitor.config = { 
        appkey : 'xxxxx',
        disable : xx,
        uploadurl : 'http://xxxx'
    }    

    Vue.config.errorHandler = function (err) {
        YZMonitor.notify(err);
    };    

```