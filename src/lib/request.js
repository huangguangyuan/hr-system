import axios from 'axios';
import { Message } from 'element-ui';
import utils from '@/lib/utils';
import router from '@/router'

// 默认请求域名
axios.defaults.baseURL = '';
// 请求超时时间
axios.defaults.timeout = 60000;
// 请求头
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器
axios.interceptors.request.use(
    config =>{ // 每次请求时会从localStorage中获取token
        let userInfo = utils.localGet('userInfo');
        if (userInfo && userInfo.token != "") {
            config.headers.common['token'] = userInfo.token;
        } else {
            sessionStorage.clear();
            localStorage.clear();
        }
        return config
    },
    error => {
        return Promise.error(error);
    }
)

// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.code === 109) {
            let userInfo = utils.localGet('userInfo');
            utils.localRemove('userInfo');
            let pathUrl = "/";
            if (userInfo && (userInfo.roleTypeId == 2 || userInfo.roleTypeId == 1)){
              pathUrl ="/hr";
            }
            router.replace({
              path: pathUrl
            })
        }
        return response;
      }, 
      error => {
        console.log(error);
        // Message.error({
        //     message: `系统异常（${error.response.status}），请重试`,
        //     duration: 3000
        // })
        return Promise.reject(error);
      }
)

export default axios