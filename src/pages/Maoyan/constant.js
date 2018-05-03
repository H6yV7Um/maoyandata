import moment from 'moment';
import react from 'react';

export const region_type = {
  0: '全国',
  1: '一线城市',
  2: '二线城市',
  3: '三线城市',
  4: '四线城市'
};

export const columns = [
    {
        title: '排行',
        key:'rank',
        width:40,
        render: (text,record,index) => {
           return parseInt(index)+1
        }
      },
      {
        title: '院线名',
        width:120,
        dataIndex: 'yxName',
        key: 'yxName'
      },
    {
        title: '票房',
        dataIndex: 'boxInfo',
        width:40,
        key: 'boxInfo'
    },
    {
        title: '人次',
        dataIndex: 'viewInfo',
        width:40,
        key: 'viewInfo'
    },
    {
        title: '场均人次',
        dataIndex: 'avgShowView',
        key: 'avgShowView',
        width:40
    },
    {
        title: '平均票价',
        dataIndex: 'avgViewBox',
        key: 'avgViewBox',
        width:40
    },
  {
    title: 'yxId',
    dataIndex: 'yxId',
    key: 'yxId',
    width:60
  }
];

// api
export const getTableList = '/api/cinema/yxBox/filter/list.json';


