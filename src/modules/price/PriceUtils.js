import React, { Component } from 'react';
import {Select} from 'antd';
const { Option, OptGroup } = Select;

export const dispatchData = {
  '1':'强指派',
  '0':'非强指派',
};

export const statusData = {
  '2':'生效中',
  '3':'已停用'
};

const levelType = {
  "1": "一星运单",
  "2": "二星运单",
  "3": "三星运单"
};

export const getOptions = (obj,all=true) => {
  const resultA = Object.keys(obj).map(item=><Option key={item} value={item}>{obj[item]}</Option>);
  all && resultA.unshift(<Option key={''} value={''}>全部</Option>);
  return resultA;
}

/*
*dataSource:[{id:'',text:''}]
*/
export class SelectModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectVal: props.value || '',
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({selectVal: value});
    }
  }
  handleSelect = (value) => {
    if (!('value' in this.props)) {
      this.setState({ selectVal:value });
    }
    this.triggerChange(value);
  }
  triggerChange = (changedValue) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }
  render() {
    const {selectVal} = this.state;
    const {dataSource,...others} = this.props;
    return (
    <Select
        value={selectVal}
        onChange={this.handleSelect}
        {...others}
    >
    {dataSource.map(item=><Option key={item.id} value={item.id}>{item.text}</Option>)}
    </Select>
    );
  }
}
// 标品类型
export const grandType = window.grandType || {
    "1": {
      "all1":"全部",
      "44": "饿了么-蜂鸟专送",
      "47":"饿了么-蜂鸟众包",
      "50":"开放平台-即时送-众包",
      "51":"蜂鸟商家-众包",
      "400102": "百度-秒送"
    },
    "2": {
      "all2":"全部",
      "58": "饿了么-蜂鸟快送",
      "400070":"饿了么-新零售",
      "400101":"百度-快送"
    },
    "3": {
      "all3":"全部",
      "400076": "饿了么-混合送",
      "400100":"百度-混合送",
      "46":"饿了么-蜂鸟专送KA",
      '6865': '全城送',
      '6866': '百度-全城送',
    }
  };


  // 获取标品文案，参数标品id
  export const getGrandText = (val) => {
    let text = '-';
    for(let key in grandType){
      grandType[key][val] && (text = grandType[key][val]);
    }
    return val ? text : '-';
  }
  
  export const getProductOption = (level) => {
    let optionA = [];
    optionA.push(<Option key={'all'+level} value={'all'+level}>{'全部'}</Option>);
    for (var key in grandType[level]) {
    　　if(grandType[level].hasOwnProperty(key) && key.indexOf('all') === -1){
      　 optionA.push(<Option key={key} value={key}>{grandType[level][key]}</Option>);
    　　}
    }
    return optionA;
  }

  export const getAllProductOption = () => {
    return ["1","2","3"].map(item=>{
      return (<OptGroup key={item} label={levelType[item]}>
          {getProductOption(item)}
       </OptGroup>);
    });
  }

  export const getGrand = (grand) => {
    let res = '';
    if (!!grand){
      grand.indexOf('all') === -1 && (res = grand);
    }
    return res;
  }