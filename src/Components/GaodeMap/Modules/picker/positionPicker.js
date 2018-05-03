import React from 'react';
import { message } from 'antd';

/**
 * @file 拖拽选址，默认拖拽地图
 * @author wenshuangyun
 * -----------------------------------------
 */
class PositionPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      value: 1,
      position: {
        longitude: 120,
        latitude: 30
      },
      offset: [0, 0],
      size: {
        width: 200,
        height: 140,
      },
    }
    if (typeof window !== 'undefined') {
      if (!props.map) {
        console.log('MAP_INSTANCE_REQUIRED');
      } else {
        this.map = props.map;
        this.loadPositionPicker();
        
      }
    }
  }
  loadPositionPicker = () => {
    const { config } = this.props;
    let self = this;
    
    window.AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
      let positionPicker = new PositionPicker({
        mode: (config.mode && config.mode) || 'dragMap',  // 拖拽地图模式，可选'dragMap'、'dragMarker'
        map: self.map
      });
      
      window.positionPicker = positionPicker;
      let infoWindow = new window.AMap.InfoWindow({
        offset: new window.AMap.Pixel(0, -20)
      });
      positionPicker.on('success', function(positionResult) {
        infoWindow.setMap(self.map);
        infoWindow.setPosition(positionResult.position);
        infoWindow.setContent('<span style="margin-right:10px">' + positionResult.address + '</span>');
        infoWindow.open(self.map, positionResult.position);
        self.onChange(positionResult);
      });
      positionPicker.on('fail', function(positionResult) {
        // 海上或海外无法获得地址信息
        message.error('非有效地址，请重新选址！');
        self.onChange({address: '非有效地址'});
      });
      self.map.on('dragstart', function() {
        if (config.mode === 'dragMarker') return;
        infoWindow.close();
      });
    });
  }
  onChange = (value) => {
    this.props.onChange && this.props.onChange(value);
  }
  render() {
    return (null);
  }
}

export default PositionPicker;
