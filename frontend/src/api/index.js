import axios from "axios";

// 这里取决于登录的时候将 token 存储在哪里
let token = localStorage.getItem("token");

const instance = axios.create({
  timeout: 100000,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache"
  }
});

// 设置post请求头
// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 将 token 添加到请求头
    token && (config.headers.Authorization = token);
    // 禁止缓存
    config.params = {
      timestamp: get_timestamp(),
      ...config.params
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    // 相应错误处理
    // 比如： token 过期， 无权限访问， 路径不存在， 服务器问题等
    switch (error.response.status) {
      case 400:
        error.response.message = error.response.data.message;
        break;
      case 401:
        error.response.message = "Unauthorized(401)";
        break;
      case 403:
        error.response.message = "Access Denied(403)";
        break;
      case 404:
        error.response.message = "Request Error(404)";
        break;
      case 408:
        error.response.message = "Request Timeout(408)";
        break;
      case 500:
        error.response.message = "Server Error(500)";
        break;
      case 501:
        error.response.message = "Service Not Implemented(501)";
        break;
      case 502:
        error.response.message = "Network Error(502)";
        break;
      case 503:
        error.response.message = "Service is not available(503)";
        break;
      case 504:
        error.response.message = "Timeout(504)";
        break;
      case 505:
        error.response.message = "HTTP does not support(505)";
        break;
      default:
        error.response.message = `Connect error(${error.response.status})!`;
    }
    return Promise.reject(error);
  }
);

function get_timestamp() {
  let date = new Date();
  let now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  return new Date(now_utc).getTime();
}

export default instance;
