import React from 'react';
import PositionPicker from './positionPicker';
import PoiPicker from './poiPicker';

/**
 * @file 选址(拖拽选址，搜索POI选址)
 * @author wenshuangyun
 * onChange 方法会传出选址后的一些信息
 * tip：次组件会创建两个全局变量 window.positionPicker 和 window.poiPicker，
 * 它们本应在组件卸载时删除，但暂未实现，如果在使用过程中报warning，可以在外部代码中删除
 * -----------------------------------------
 */
class Picker extends React.Component {
  onPositionChange = (value) => {
    this.onChange(value);
  }
  onPoiChange = (value) => {
    this.onChange(value);
  }
  onChange = (value) => {
    this.props.onChange && this.props.onChange(value);
  }
  render() {
    const { config, __map__ } = this.props;
    return (
      <div>
        {config.position && 
        <PositionPicker 
          config = { config.position } 
          map = { __map__ } 
          onChange = { this.onPositionChange }
        />}
        {config.poi && 
        <PoiPicker
          map = { __map__ }
          onChange = { this.onPoiChange }
        />
        }
      </div>
    );
  }
}

export default Picker;
