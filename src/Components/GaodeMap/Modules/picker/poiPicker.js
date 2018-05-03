import React from 'react';
import { Input, Button } from 'antd';

/**
 * @file 搜索POI选址
 * @author wenshuangyun
 * -----------------------------------------
 */
class PoiPicker extends React.Component {
  constructor(props) {
    super(props)
    if (typeof window !== 'undefined') {
      if (!props.map) {
        console.log('MAP_INSTANCE_REQUIRED');
      } else {
        this.map = props.map;
        this.loadPoiPicker();
      }
    }
  }
  loadPoiPicker = () => {
    let self = this;
    window.AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
      let poiPicker = new PoiPicker({
        input: 'pickerInput' //输入框id
      });
      self.poiPickerReady(poiPicker);
    });
  }
  poiPickerReady = (poiPicker) => {
    window.poiPicker = poiPicker;
    let marker = new window.AMap.Marker();
    let infoWindow = new window.AMap.InfoWindow({
      offset: new window.AMap.Pixel(0, -20)
    });
    let self = this;
    //选取了某个POI
    poiPicker.on('poiPicked', function(poiResult) {
      let poi = poiResult.item;
      if (!window.positionPicker) {
        marker.setMap(self.map);
        marker.setPosition(poi.location);
        infoWindow.setMap(self.map);
        infoWindow.setPosition(poi.location);
        infoWindow.setContent(
          '<span style="margin-right:10px">' + poi.name + '</span><hr/>地址：' + poi.address
        );
        infoWindow.open(self.map, poi.location);
        self.onChange(poiResult);
      }
      self.map.setCenter(poi.location);
    });
  }
  handleSearch = () => {
    let keyword = document.getElementById('pickerInput').value;
    window.poiPicker.searchByKeyword(keyword);
  }
  onChange = (value) => {
    this.props.onChange && this.props.onChange(value);
  }
  render() {
    return (
      <div style = {{ position: 'absolute', top: '8px', left: '10px' }}>
        <Input 
          id = 'pickerInput' 
          style = {{ width: '500px', marginRight: '10px' }} 
          placeholder = '输入小区/写字楼/学校等，回车搜索'
        />
        <Button onClick = { () => this.handleSearch() }>搜索</Button>
      </div>
    );
  }
}

export default PoiPicker;
