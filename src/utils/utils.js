import {city} from '../Components/city';
import { getFetch } from './fetch';

 // 删除为空的参数
export const fiterParms = (params) => {
    for (let key in params) {
      (params[key] === "" ||  params[key] === undefined) && (delete params[key]);
    }
    return params;
}


/**
 * [日期转化工具]
 * @param  {[date]} dateobj [日期对象]
 * @param  {[string]} format [转化格式 yyyy-MM-dd hh:mm:ss]
 * @return {[boolean]}
 */
export const formatDate = (dateobj, format) => {
  var date = {
    "M+": dateobj.getMonth() + 1,
    "d+": dateobj.getDate(),
    "h+": dateobj.getHours(),
    "m+": dateobj.getMinutes(),
    "s+": dateobj.getSeconds(),
    "q+": Math.floor((dateobj.getMonth() + 3) / 3),
    "S+": dateobj.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (dateobj.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === (1 || '1')
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

// 拦截err并toastr 为antd的form
export const intercept = (err) => {
  return err ? err[Object.keys(err)[0]].errors[0].message : false;
}

export const getCityName = (city_code) => {
  const cityA = window.city_list.length ? window.city_list : city;
  const re = cityA.filter(item=>Number(item.id)===Number(city_code));
  return !!re.length ? re[0].name : '';
}

const toArray  = (min,max) => {
  // (min,max)
  min = Number(min);
  max = Number(max);
  const len = max - min;
  return Array.from(new Array(len), (v,i) => { return i + min + 1});
}
// 校验范围重叠
export const isOverlap = (arr) => {
  let numR = [];
  let isRepeat = false;
  const copy = JSON.parse(JSON.stringify(arr));
  const isTime = arr[0].range[0].split && arr[0].range[0].split(':').length >=2;
  if (isTime) {// 时间 length不相等 有重复数据及重叠
    copy.sort((a,b)=>{
      return a.range[0].replace(/:/,'') - b.range[0].replace(/:/,'');
    });
    // console.log(copy);
    copy.forEach((item,inx)=>{
      if (item && copy[inx+1] && item.range[1] && copy[inx+1].range[0]) {
        isRepeat = item.range[1] > copy[inx+1].range[0];
      }
    });
  }else { // 纯数字
    arr.forEach((item)=>{
      numR = numR.concat(toArray(item.range[0],item.range[1]));
    });
    isRepeat = [...new Set(numR)].length !== numR.length;
  }
  return isRepeat;
}

export const isEmpty = (arr) => {
  let empty = false;
  arr.forEach((item)=>{
    if (!item.range[0] || !item.range[1] || (!item.bonus && item.bonus !== 0)) {
      empty = true;
      return;
    }
  });
  return empty;
}

export const noStandard = (arr) => {
  let err = false;
  arr.forEach((item)=>{
    const min = item.rangeMin || item.range[0];
    const max = item.rangeMax || item.range[1];
    if (min >= max) {
      err = true;
      return;
    }
  });
  return err;
}
const toArray2  = (min,max) => {
  // (min,max)
  min = Number(min) + 1;
  max = Number(max);
  const len = max - min;
  return Array.from(new Array(len), (v,i) => { return i + min});
}

export const getAllHour = (arr) => {
  let hourR = [];
  arr.forEach((item)=>{
    if(item.min && item.max) {
       const tempS = item.min.split(':');
      const tempE = item.max.split(':');
      hourR = hourR.concat(toArray2(tempS[0],tempE[0]));
    }
  });
  return [...new Set(hourR)];
}

export const getAllMinute = (arr) => {
  let minuteR = [];
  arr.forEach((item)=>{
    const tempS = item.range[0].split(':');
    const tempE = item.range[1].split(':');
    minuteR = minuteR.concat(toArray(tempS[1],tempE[1]));
  });
  return [...new Set(minuteR)];
}

export const limitDecimals = (value) => {
  const reg = /^(\-)*(\d+)\.(\d).*$/;
  if(typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
  } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
  } else {
      return ''
  }
};

export const baiduToGaode = (lng, lat) => {
  const x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  let x = lng - 0.0065, y = lat - 0.006;  
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);  
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);  
  let tempLon = z * Math.cos(theta);  
  let tempLat = z * Math.sin(theta);  
  return { lng: tempLon, lat: tempLat }; 
}  

