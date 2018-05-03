import React from 'react';

/**
 * @file 定位
 * @author wenshuangyun
 * -----------------------------------------
 */
class Geolocation extends React.Component {
  constructor(props) {
    super(props)
    if (typeof window !== 'undefined') {
      if (!props.__map__) {
        console.log('MAP_INSTANCE_REQUIRED');
      } else {
        this.map = props.__map__;
        this.loadGeolocation();
      }
    }
  }
  loadGeolocation = () => {
    let geolocation = new window.AMap.Geolocation({
      enableHighAccuracy: true,   //是否使用高精度定位，默认:true
      timeout: 10000,             //超过10秒后停止定位，默认：无穷大
      zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      buttonPosition: 'RB',
      buttonOffset: new window.AMap.Pixel(14, 130),   //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      panToLocation: true,  //定位成功后将定位到的位置作为地图中心点
    });
    this.map.addControl(geolocation);
    geolocation.getCurrentPosition();
    window.AMap.event.addListener(geolocation, 'complete', this.onComplete); //返回定位成功信息
    window.AMap.event.addListener(geolocation, 'error', this.onError);       //返回定位出错信息
  }
  onComplete = (data) => {
    //this.map.setCenter(data.position);
    window.positionPicker && window.positionPicker.start();  // 写在这里是因为想把拖拽的起点放在定位的点上
  }
  onError = (data) => {
    console.log('定位失败')
  }
  render() {
    return (null);
  }
}

export default Geolocation;
