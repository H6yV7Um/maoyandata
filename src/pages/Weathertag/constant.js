import moment from 'moment';

export const recordState = {
  '': '全部',
  0: '生效中',
  1: '已失效',
};

export const columns = [
  {
    title: '记录名称',
    dataIndex: 'alias_name',
    key: 'alias_name'
  },
  {
    title: '城市',
    dataIndex: 'city_name',
    key: 'city_name'
  },
  {
    title: '网格ID',
    dataIndex: 'grid_id',
    key: 'grid_id'
  },
  {
    title: '天气标签',
    dataIndex: 'weather_tag',
    key: 'weather_tag'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    render: (text, index) => (
      (text) ? (moment(text).format('YYYY/MM/DD HH:mm:ss')) : ('-')
    )
  },
  {
    title: '失效时间',
    dataIndex: 'off_time',
    key: 'off_time',
    render: (text, index) => (
      (text) ? (moment(text).format('YYYY/MM/DD HH:mm:ss')) : ('-')
    )
  },
  {
    title: '创建人',
    dataIndex: 'operator',
    key: 'operator'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      return recordState[text];
    }
  }
];

// api
export const getTableList = '/talaris-kerrigan/grid_weather/';
export const uploadFile = '/talaris-kerrigan/grid_weather/upload/file';
export const getCityList = '/talaris-kerrigan/order/city_list';

