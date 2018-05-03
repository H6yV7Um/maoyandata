/**
 * @file 复合组件，时间段选择器组件
 * @author ["lishaoyi", "lihuan", "wenshuangyun"]
 * @version 0.0.3
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { TimePicker, Button } from 'antd';
import './styles.less';

/**
 * 组件属性申明
 * @property {bool} start 开始时间
 * @property {bool} end 结束时间
 * @property {bool} disabled 时间段是否可编辑
 * @property {string} format 时间格式，默认为"HH:mm:ss"
 * @property {function} onDelete 删除时间段 ［无参］
 * @property {function} onChange 时间change事件 ［一个参数，为object］
 */

/**
 * 主组件
 * @class TimeRangePicker
 * @extends {React.Component}
 */
class TimeRangePicker extends React.Component {
    /**
     * Creates an instance of TimeRangePicker.
     * @param {any} props
     * @memberOf TimeRangePicker
     */
    constructor(props) {
        super(props);
        this.state = {
            start: { time: '' },
            end: { time:'' }
        }
    }

    /**
     * 返回从 start 到 end 这一段连续的数据组成的数组 pure
     * @param {Number} start 起始数据
     * @param {Number} end 结束数据
     * @return {Array} result 时间段数组
     * @memberOf TimeRangePicker
     */
    newArray(start, end) {
      let result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    }

    /**
     * 起始时间发生变化事件（改变 state,设置 state.start.time 为改变后的时间）
     * @param {moment} date，选择的 date
     * @param {string} dateString，选择的 string 类型的 date（03:02）
     * @memberOf TimeRangePicker
     */
    onStartChange(date, dateString) {
      this.setState({
        start: { ...this.state.start, time: dateString }
      })
      this.onChange(dateString, this.state.end.time)
    }

    /**
     * 结束时间发生变化事件（改变 state,设置 state.end.time 为改变后的时间）
     * @param {moment} date，选择的 date
     * @param {string} dateString，选择的 string 类型的 date
     * @memberOf TimeRangePicker
     */
    onEndChange(date, dateString) {
      this.setState({
        end:{ ...this.state.end, time:dateString }
      })
      this.onChange(this.state.start.time, dateString)
    }

    /**
     * 为组件传入的 change action 传当前时间段
     * @param {string} start，change 事件后的起始时间
     * @param {string} end，change 事件后的结束时间
     * @memberOf TimeRangePicker
     */
    onChange(start,end){
      this.props.onChange && this.props.onChange({start,end})
    }

    // 根据props:disabledTime{start:['54000', '86400'], end: ['54000', '86400']}
    // 获取综合endTime 以及 startTime后的 disabled-time
    getCheckedHour(hours, obj, time) {
      const { disabledTime } = this.props;
      let disabledH = [];
      if(disabledTime && disabledTime[obj]) {
        let disabledHFrom = disabledTime[obj][0] / 60 / 60;
        let disabledHTo = disabledTime[obj][1] / 60 / 60;
        // console.log('disabledTime',disabledTime,disabledHFrom, disabledHTo, hours)
        if(hours > 0 && hours <=24) {
          if(hours < disabledHFrom || hours > disabledHTo) { // disabledTime: [0, 15]   hours: 8
            disabledH = this.newArray(disabledHFrom, disabledHTo);
            if(obj === 'start') {
              disabledH = disabledH.concat(this.newArray(hours+1, 24));
            } else if (obj === 'end') {
              disabledH = disabledH.concat(this.newArray(0, hours));
            }
          } else if (hours === disabledHTo || hours === disabledHFrom) { 
            // 存在初始值与临界值相等，则默认disabledHour为disabledTime区间
            disabledH = this.newArray(disabledHFrom, disabledHTo);
          }
        } else {
          disabledH = this.newArray(disabledHFrom, disabledHTo);
        }
      } else {
        if(obj === 'start') {
          disabledH = hours ? this.newArray(hours + 1, 24) : [];
        } else if (obj === 'end') {
          disabledH = this.newArray(0, hours);
        }
      }
      return disabledH;
    }

    /**
     * 禁止用户选择某个起始时间段中的 hours 时间段（结束时间 endTime 的 hours 之后禁用）pure
     * @param {String} endTime 已选择时间的 结束时间
     * @return {Array}，禁用的 hours 时间段数组
     * @memberOf TimeRangePicker
     */
    disabledStartHours(endTime) {
      let hours = endTime && Number(endTime.split(':')[0])
      // return hours ? this.newArray(hours + 1, 24) : [];
      return this.getCheckedHour(hours, 'start');
    }

    /**
     * 禁止用户选择某个起始时间段中的已选择 hour 的 minutes 时间段（结束时间 endTime 的 minutes 之后禁用）pure
     * @param {Number} h 已选择时间的 hour
     * @param {String} endTime 已选择时间的 结束时间
     * @return {Array} 禁用的 minutes 时间段数组
     * @memberOf TimeRangePicker
     */
    disabledStartMinutes(h, endTime) {
      let hours = endTime && Number(endTime.split(':')[0])
      let minutes = endTime && Number(endTime.split(':')[1])
      return hours === h ? this.newArray(minutes+1, 60) : [];
    }
    disabledStartSeconds(h, m, endTime) {
      if(endTime) {
        let hours = Number(endTime.split(':')[0]);
        let minutes = Number(endTime.split(':')[1]);
        let seconds = Number(endTime.split(':')[2]) || 0;
        return hours === h && minutes === m ? this.newArray(seconds, 60) : [];
      }
      return [];
    }
    /**
     * 禁止用户选择某个结束时间段中的 hours 时间段（起始时间 startTime 的 hours 之前禁用）pure
     * @param {String} startTime 已选择时间的 起始时间
     * @return {Array} 禁用的hours时间段数组
     * @memberOf TimeRangePicker
     */
    disabledEndHours(startTime) {
      let hours = startTime && Number(startTime.split(':')[0])
      // return this.newArray(0, hours);
      return this.getCheckedHour(hours, 'end');
    }

    /**
     * 禁止用户选择 某个结束时间段中的已选择 hour 的 minutes 时间段（起始时间 startTime 的 minutes 之前禁用）pure
     * @param {String} startTime 已选择时间的 起始时间
     * @param {Number} h，已选择时间的 hour
     * @return {Array} 禁用的 hours 时间段数组
     * @memberOf TimeRangePicker
     */
    disabledEndMinutes(h, startTime) {
      let hours = startTime && Number(startTime.split(':')[0])
      let minutes = startTime && Number(startTime.split(':')[1])
      return hours === h ? this.newArray(0,minutes) : [];
    }

    disabledEndSeconds(h, m, startTime) {
      if(startTime) {
        let hours = Number(startTime.split(':')[0]);
        let minutes = Number(startTime.split(':')[1]);
        let seconds = Number(startTime.split(':')[2]) || 60;
        return hours === h && minutes === m ? this.newArray(0, seconds+1) : [];
      }
      return [];
    }

    /**
     * 组件加载后，改变 state 为用户设置的初始时间段
     * @memberOf TimeRangePicker
     */
    componentDidMount(){
      this.setState({
        start: { time: this.props.start },
        end: { time: this.props.end }
      });
      this.onChange(this.props.start, this.props.end);
    }
    componentWillReceiveProps(nextProps) {
      this.setState({ 
        start: { time: nextProps.start },
        end: { time: nextProps.end }
      })
    }
    render() {
      const { disabled, start, end, format} = this.props;
      const this_format = format || "HH:mm:ss";
      return (
        <div className='wl-timerangepicker-wrapper'>
          <TimePicker
            className = "wl-timerangepicker-start-time"
            disabled = { disabled }
            placeholder = "开始时间"
            value = { moment(start || "00:00:00", this_format) }
            disabledHours = { this.disabledStartHours.bind(this, this.state.end.time) }
            disabledMinutes = { (selectedHour) => this.disabledStartMinutes(selectedHour, this.state.end.time) }
            disabledSeconds = { (selectedHour, selectedMinute) => this.disabledStartSeconds(selectedHour, selectedMinute, this.state.end.time) }
            onChange = { this.onStartChange.bind(this) }
            format = { this_format } />
          {' '}至{' '}
          <TimePicker
            className = "wl-timerangepicker-end-time"
            disabled = { disabled }
            placeholder = "结束时间"
            value = { moment(end || "23:59:59", this_format) }
            disabledHours = { this.disabledEndHours.bind(this, this.state.start.time) }
            disabledMinutes = { (selectedHour) => this.disabledEndMinutes(selectedHour, this.state.start.time) }
            disabledSeconds = { (selectedHour, selectedMinute) => this.disabledEndSeconds(selectedHour, selectedMinute, this.state.start.time) }
            onChange = { this.onEndChange.bind(this) }
            format = { this_format } />
          { this.props.onDelete ?
            <Button
              icon = "minus-circle-o"
              className = "btn btn-danger"
              disabled = { disabled }
              onClick = { this.props.onDelete } ></Button> : null }
        </div>)
    }
}

TimeRangePicker.applypropTypes = {
  start: PropTypes.moment,
  end: PropTypes.moment,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  onDelete: PropTypes.func,
  onChange: PropTypes.func
};

export default TimeRangePicker;
