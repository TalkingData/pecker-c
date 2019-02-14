import apischema from 'apischema';
import axios from 'axios/dist/axios.min';
// import Cookies from 'js-cookie';
import {
  Message,
} from 'iview';
import Utils from '@/lib/utils';
import router from '../router';

axios.defaults.withCredentials = true;

const baseURL = Utils.baseUrl();
const timeout = 30000;
const http = axios.create({
  baseURL,
  timeout,
});
// let errorFlag = false;
let startTime = new Date().getTime();
let path = '/login';

router.beforeEach((to, from, next) => {
  /**
   * 如果是接口 401 跳转到登录页面的情况
   * 用 document.baseURI 截取字符串
   * 得到需要登录后跳转的 url
   */
  const url = document.baseURI;
  const len = url.length;
  const hashPos = url.indexOf('#');
  const cbUrl = url.substring(hashPos + 2, len);
  path = `/login?url=/${cbUrl}`;

  next();
});

// 添加请求拦截器
http.interceptors.request.use((config) => {
  const rtn = config;
  const token = ''; // 让每个请求头携带token
  if (token) {
    rtn.headers.token = token;
  }
  if (config.method === 'post' && config.data.testData) {
    rtn.data = rtn.data.testData; // 调用演示post传的data参数直接赋值给请求的data
  }
  return rtn;
}, error => Promise.reject(error));

// 添加响应拦截器
http.interceptors.response.use(response => response.data, (error) => {
  if (error.response.status === 401) { // 接口401登录拦截
    const enterTime = new Date().getTime();
    router.push({
      path,
    });
    if (enterTime - startTime > 3000) { // 设置三秒时间间隔，方式错误信息弹出太多
      Message.error('登录信息过期，请重新登录！');
      startTime = new Date().getTime();
    }
  } else if (error.response.status === 403) {
    Message.error('您没有此项操作的权限！');
  }
  return Promise.reject(error.response.data);
});

const schema = apischema({
  http,
});

export default schema;
