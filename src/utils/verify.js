export const isNumber = (value) => {
  return /^\d*$/.test(value);
}

/**
 * 判断数据类型
 * @obj 数据
 * @types 数据类型
 *
 * @return Boolean
*/
export const isType = (obj, types) => {
  return Object.prototype.toString.call(obj) === '[object '+ types +']';
}
