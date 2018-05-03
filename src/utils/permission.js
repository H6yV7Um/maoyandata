import axios from 'axios';
import { pageCodeMap,btnCodeMap } from './constant';
import {permissionUri,cityListUri} from './server';

let _permissions = null;
let _cityList = null;
window.city_list = [];
const pathKey = window.location.hash.replace(/#\//,'');

const fetchCity = () => {
  return axios.get(cityListUri);
}
const fetchAuth = () => {
  return axios.get(permissionUri);
}
export const getAccessData = () => {
  if (_permissions && _cityList) return Promise.resolve({
    citylist:_cityList,
    perms: _permissions
  });
  _permissions = {};
  return new Promise((resolve, reject) => {
    axios.all([fetchAuth(),fetchCity()])
    .then(axios.spread(function (auth,city) {
      // console.log(auth,city);
      if(Number(auth.data.code) === 200) {
        auth.data.data.forEach(item => {
          _permissions[item.code] = true;
        });
        // window._permissions = _permissions;
      };
      if(Number(city.data.code) === 200) {
        _cityList = city.data.data;
        window.city_list = _cityList;
      };
      return resolve({
        citylist:_cityList || [],
        perms: _permissions
      });
    })).catch(reject);
  });
}

// 是否有相关权限 true/false
export const seesee = (key) => {
  const code = pathKey && btnCodeMap[pathKey] && btnCodeMap[pathKey][key];
  return true;
  // return _permissions && _permissions[code];
}

// 是否有相关权限 component
export const biubiu = (key) => (component) => {
  const code = pathKey && btnCodeMap[pathKey] && btnCodeMap[pathKey][key];
  return component;
  /*if (code) {
    return _permissions && _permissions[code] ? component : null;
  } else {
    return component;
  }*/
}

export const checkPageAuth = (component) => {
  const code = pageCodeMap[pathKey];
  if (code) {
    return _permissions && _permissions[code] ? component : null;
  } else {
    return component;
  }
}