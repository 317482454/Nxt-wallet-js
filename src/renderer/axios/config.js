import store from './../store/index'
import axios from 'axios'

axios.interceptors.request.use(function (config) {
        // if(config.url.indexOf(store.state.url)==-1){
        //     config.headers['api'] = config.url
        //     config.url=store.state.url+'proxy?'
        // }
        return config;
  },
  function (error) {
    return Promise.reject(error);
  });//请求拦截器


axios.interceptors.response.use(response => {
  return response;
}, (responseError) => {
  return Promise.reject(responseError);
});//响应拦截器




