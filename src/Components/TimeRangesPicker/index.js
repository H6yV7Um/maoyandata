import React, { Component } from 'react';
import { Icon, Button } from 'antd';
import TimeRangePicker from '../TimeRangePicker';
import './index.less';

/**
 * @file 多组时间选择器，支持增减组数
 * @author wenshuangyun
 * -----------------------------------------
 * @property {string}  format       时间格式，默认'HH:mm'
 * @property {boolean} disabled     不可用状态
 * @property {array}   initial_data 初始数据
 * @property {number}  max_num      组数上限，超过此值不可添加选择器
 */

class TimeRangesPicker extends Component {
  state = { 
    datas: this.props.initial_data ? this.props.initial_data.concat() : [{begin: '00:00', end: '00:00', key: 0}]
  };
  addTimeRange = () => {
    let datas = this.state.datas;
    datas.push({begin: '00:00', end: '00:00', key: datas[datas.length-1].key + 1});
    this.setState({datas: datas});
  }
  removeTimeRange = (k) => {
    let datas = this.state.datas;
    if (datas.length === 1) return;
    datas = datas.filter(item => item.key !== k);
    this.setState({datas: datas});
    this.onChange(datas);
  }
  handleChange(value, index) {
    let datas = this.state.datas;
    datas[index].begin = value.start;
    datas[index].end = value.end;
    this.setState({datas: datas});
    this.onChange(datas);
  }
  onChange(value){
    this.props.onChange && this.props.onChange(value)
  }
  componentDidMount() {
    this.onChange(this.state.datas);
  }
  render() {
    const {format, disabled, max_num} = this.props;
    const TimeRangesContent = this.state.datas.map((item, index) => {
      return (
        <div style={{position: 'relative', marginBottom: '5px'}} key={item.key}>
          <TimeRangePicker 
            format = {format ? format : 'HH:mm'} 
            disabled = {disabled ? true : false}
            start = { item.begin }
            end = { item.end } 
            onChange = {(value)=>this.handleChange(value, index)} 
          />
          {disabled ? '' : 
          <Icon 
            className = "dynamic-delete-button" 
            disabled = { this.state.datas.length === 1 }
            type = "minus-circle-o" 
            onClick = { () => this.removeTimeRange(item.key) } 
          />}
        </div>
      );
    });
    return (
      <div>
        {TimeRangesContent}
        {!disabled &&
        <Button 
          type = "primary" 
          shape = "circle" 
          icon = "plus" 
          size = "small" 
          disabled = { max_num ? this.state.datas.length >= max_num : false }
          onClick = { () => this.addTimeRange() }
        ></Button>}
      </div>
    );
  }
}

export default TimeRangesPicker;
