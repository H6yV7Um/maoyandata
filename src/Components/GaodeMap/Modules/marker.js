import React from 'react';

/**
 * @file 显示单个坐标点
 * @author wenshuangyun
 * 待处理，可以用 REACT-AMAP 的 Marker
 * -----------------------------------------
 */
class SingleMarker extends React.Component {
  constructor(props) {
    super(props)
    if (typeof window !== 'undefined') {
      if (!props.__map__) {
        console.log('MAP_INSTANCE_REQUIRED');
      } else {
        this.map = props.__map__;
        this.loadMarker();
      }
    }
  }
  loadMarker = () => {
    const { position } = this.props;
    let marker = new window.AMap.Marker();
    marker.setMap(this.map);
    let pos = new window.AMap.LngLat(position.longitude, position.latitude);
    marker.setPosition(pos);
    setTimeout(()=>{this.map.setCenter(pos)}, 800);  //如果不延时就不生效，这块待优化
  }
  render() {
    return (null);
  }
}

export default SingleMarker;
