import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { Map, Circle, Markers } from 'react-amap';
import Geolocation from './Modules/geolocation';
import Picker from './Modules/picker';
import SingleMarker from './Modules/marker';

// const AMAP_KEY = '362d4896fe6460beda77173379621c65';
const AMAP_KEY = '28966b6be8e4fa0e4c4f4c9b4bf8d3ce';
const VERSION = '1.4.3';

/**
 * @file 高德地图
 * @author wenshuangyun
 * Map组件的用法参考 https://elemefe.github.io/react-amap/components/about
 * 此地图组件实例化对象存在 window.mapInstance 中，可在外部对其进行引用操作
 * 如果业务功能较复杂且复用程度较低的话，可参考上述链接在自己的业务模块下单独开发
 * 当前的地图组件实现的功能较少，在使用过程中可以在 Modules 中添加功能，用 props 进行限制
 * 如果需要该组件传出一些值，可在 this.state.change_value 中填加，并用 onChange 方法传出，注意不要覆盖已有的
 * -----------------------------------------
 * @property {string}      id      渲染地图的元素id
 * @property {object}      style   渲染地图的元素style
 * @property {number}      zoom    地图的初始缩放级别
 * @property {array}       plugins 地图控件
 * @property {bool}        locate  是否启用定位插件，默认true
 * @property {bool}        scrollWheel  是否可通过鼠标滚轮缩放，默认true
 * @property {bool|object} marker  展示单个坐标点，默认false
 *           marker = {
 *             longitude: number,   // 经度
 *             latitude: number     // 纬度
 *           }
 * @property {bool|object} picker  是否开启选址，默认false
 *           picker = {
 *             position : bool|object,  //拖拽选址，object可设置拖拽模式{mode:'xxx'}
 *             poi: bool  //搜索poi选址
 *           }
 * @property {bool|object} circle  画圆，默认false
 *           circle = {
 *             center: {longitude: 116, latitude: 39},  //圆心，必须
 *             radius: 15000,  //半径，必须
 *             style: {}    //样式
 *           }
 * @property {bool|object} markers  多个坐标点，默认false
 *           markers = {
 *             data: [{            
 *               position: {longitude: xxx, latitude: xxx} //坐标，必须
 *             }, 
 *             ...
 *             ]
 *           }
 */
class GaodeMap extends Component {
  constructor() {
    super();
    this.state = {
      change_value: { 
        picker_value: ''
      }
    }
    this.amapEvents = {
      created: ( mapInstance ) => {
        window.mapInstance = mapInstance;
      }
    };
    this.circleEvents = {
      created: ( circleInstance ) => {
        window.circleInstance = circleInstance;
      }
    };
  }
  onPickerChange = (value) => {
    let { ...copy_value } = this.state.change_value;
    copy_value.picker_value = value;
    this.setState({ change_value: copy_value });
    this.onChange(copy_value);
  }
  onChange = (value) => {
    this.props.onChange && this.props.onChange(value);
  }
  render() {
    const { id, style, zoom, plugins, locate, marker, picker, circle, markers, scrollWheel } = this.props;
    const loadingStyle = {
      position: 'relative',
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };
    const Loading = <div style = { loadingStyle }><Spin size = "large" tip = "Loading Map..." /></div>;
    return (
      <div id = { id } style = { style }>
        <Map 
          amapkey = { AMAP_KEY } 
          version = { VERSION }
          useAMapUI = { true }
          plugins = { plugins } 
          loading = { Loading }
          zoom = { zoom }
          events = { this.amapEvents }
          scrollWheel = { scrollWheel }
        >
          {locate && <Geolocation />}
          {marker &&
          <SingleMarker 
            position = { marker }
          />}
          {picker && 
          <Picker 
            config = { picker } 
            onChange = { picker && this.onPickerChange }
          />}
          {circle && <Circle 
            center = { circle.center } 
            radius = { circle.radius }
            style = { circle.style }
            events = { this.circleEvents }
          />}
          {markers && <Markers 
            markers = { markers.data }
          />}
        </Map>
      </div>
    );
  }
}

// 类型检查（array, bool, func, number, object, string, symbol）
GaodeMap.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  zoom: PropTypes.number,
  plugins: PropTypes.array,
  locate: PropTypes.bool,
  marker: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  picker: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  circle: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  markers: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  scrollWheel: PropTypes.bool
}

// 属性初始值
GaodeMap.defaultProps = {
  id : "gaodemap",
  style: { height: '500px' },
  zoom: 13,
  plugins: [
    'Scale',  // 比例尺
    {
      name: 'ToolBar',  //缩放
      options: {
        autoPosition: true,
        noIpLocate: true,
        locate: false
      }
    }
  ],
  locate: true,
  marker: false,
  picker: false,
  circle: false,
  markers: false,
  scrollWheel: true
};

export default GaodeMap;
