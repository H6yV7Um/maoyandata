import { message } from 'antd';
import axios from 'axios';
import qs from 'qs';

axios.defaults.withCredentials = true;

const queryStringify = (params) => {
  let query = [];
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      query.push(key + '=' + encodeURIComponent(params[key]));
    }
  }
  return query.join('&');
}

export const getFetch = (url, params, autoErr = true) => {
  const urlString = params ? `${url}?${queryStringify(params)}` : url;
  return new Promise((resolve, reject) => {
    axios.get(urlString).then(response => {
      if (response.status === 200 && response.data) {// 请求成功
        const data = response.data;

        if (data.code === 200 || data.code === '200' || data.errno === 0) { // 返回正常
          return resolve(response.data);
        } else { // 返回异常,没权限等,抛出提示信息,code统一返回'ERR'
          const errMsg = data.msg || data.message || data.errmsg;
          errMsg && autoErr && message.error(errMsg);
          return resolve({ code: 'ERR', data: data });
        }
      } else { // 网络异常等
        return reject(response);
      }
    }).catch(reject)
  });
}

export const postFetch = (url, params, autoErr = true) => {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params)).then(response => {
      if (response.status === 200 && response.data) {
        const data = response.data;
        if (data.code === 200 || data.code === '200' || data.errno === 0) {
          return resolve(response.data);
        } else {
          const errMsg = data.msg || data.message || data.errmsg;
          errMsg && autoErr && message.error(errMsg);
          return resolve({ code: 'ERR', data: data });
        }
      } else {
        return reject(response);
      }
    }).catch(reject)
  });
}

export const deleteOpr = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.delete(url, { data: params }).then(response => {
      if (response.status === 200 && response.data) {
        const data = response.data;
        if (data.code === 200 || data.code === '200' || data.errno === 0) {
          return resolve(response.data);
        } else {
          message.error(data.msg || data.message || data.errmsg);
          return resolve({ code: 'ERR' });
        }
      } else {
        return reject(response);
      }
    }).catch(reject)
  });
}

export const postFileFetch = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(response => {
      if (response.status === 200 && response.data) {
        const data = response.data;
        if (data.code === 200 || data.code === '200' || data.errno === 0) {
          return resolve(response.data);
        } else {
          message.error(data.msg || data.message || data.errmsg);
          return resolve({ code: 'ERR' });
        }
      } else {
        return reject(response);
      }
    }).catch(reject)
  });
}