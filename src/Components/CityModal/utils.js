

const Utils = {};

Utils.organizeData = dataSource => {
  return dataSource.reduce(
    (ret, item) => {
      ret = {
        ...ret,
        [item.id]: item.cities.map(v => v.id)
      }
      return ret;
    }, {});
}

export default Utils;