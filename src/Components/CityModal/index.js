import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Tag, Checkbox } from 'antd';
import _ from 'lodash';
import Utils from './utils';
import './style.less';

const { CheckableTag } = Tag;

/**
 * 组件属性说明
 *
 * @property {string} label 弹窗title
 * @property {array} dataSource 城市数据
 *  eg: dataSource = [
 *        {
 *          "cities": [{ "id": "3", "name": "北京市" }],
 *          "id": "1",
 *          "name": "北京市"
 *        },
 *        {
 *          "cities": [{ "id": "31", "name": "石家庄市" }, { "id": "40", "name": "廊坊市" }],
 *          "id": "3",
 *          "name": "河北省"
 *        }
 *      ]
 * @property {function} onChange 选择城市
 * @property {array} value 已被选的城市数据 eg:["3","31","40"]
 * @property {function} onCancel 关闭弹窗
 */

const propTypes = {
  label: PropTypes.string,
  dataSource: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.array,
  onCancel: PropTypes.func
};

class MyTag extends React.Component {

  render() {
    const { checked, onChange } = this.props;
    return <CheckableTag
      {...this.props}
      checked={checked}
      onChange={onChange}
    />;
  }
}

class Component extends React.Component {

  // 选择城市tag
  selectCityTag = (isSelected, cityid, cityname) => {

    const { value, onChange } = this.props;

    let nextBeSlt = [];
    if (isSelected) {
      nextBeSlt = value.concat(cityid);
    } else {
      nextBeSlt = value.filter(item => item !== cityid);
    }
    onChange(nextBeSlt);
  }

  // 选择省tag
  selectProvinces = (isSelected, pvid) => {

    const { value, onChange } = this.props;

    let nextBeSlt = [];
    if (isSelected) {
      nextBeSlt = _.uniq(value.concat(this.cityMapObj[pvid]));
    } else {
      nextBeSlt = _.without(value, ...this.cityMapObj[pvid]);
    }
    onChange(nextBeSlt);
  }
  /**
   * 省tag 的checked状态
   * @returns boolean
   */
  getIsSelectPv = (pvid) => {
    const { value } = this.props;

    let sltCityInPv = [];
    this.cityMapObj[pvid].forEach(cityIdInAll => {
      value.forEach(cityid => {
        if (cityIdInAll === cityid) {
          sltCityInPv.push(cityid);
        }
      })
    });
    if (sltCityInPv.length === this.cityMapObj[pvid].length) {
      return true;
    }
    return false;
  }

  // 全选tag
  selectAllCity = (isChecked) => {
    const { onChange } = this.props;

    if (isChecked) {
      let temp = [];
      Object.keys(this.cityMapObj).forEach(key => {
        temp = temp.concat(this.cityMapObj[key]);
      })
      onChange(temp);
    } else {
      onChange([])
    }
  }

  /**
   * 是否全选
   * @returns boolean
   */
  isSelectAllCity = () => {
    const { value } = this.props;
    let allCityIdsArr = [];
    Object.keys(this.cityMapObj).forEach(key => {
      allCityIdsArr = allCityIdsArr.concat(this.cityMapObj[key]);
    });

    return allCityIdsArr.length === value.length;
  }

  render() {
    const { label, dataSource, onCancel,
      value,
    } = this.props;

    // 省-城市映射关系
    this.cityMapObj = Utils.organizeData(dataSource);

    return (
      <Modal
        title={label || ''}
        visible={true}
        width={1000}
        onOk={onCancel}
        onCancel={onCancel}
        okText="确定"
        cancelText="取消"
        className="city-modal"
      >
        <div style={{ padding: 10 }}>
          <span className="tag-boss"> 全选 </span>
          <Checkbox
            checked={this.isSelectAllCity()}
            onChange={e => this.selectAllCity(e.target.checked)} />
        </div>
        {
          dataSource.map(provinces =>
            <div key={provinces.id} className="tag-boss">
              <MyTag
                checked={this.getIsSelectPv(provinces.id)}
                onChange={e => this.selectProvinces(e, provinces.id)}
              >
                {provinces.name}
              </MyTag>
              <div className="tag-staff">
                {
                  provinces.cities.map(city =>
                    <MyTag
                      key={city.id}
                      checked={value.some(v => v === city.id)}
                      onChange={e => this.selectCityTag(e, city.id, city.name)}>
                      {city.name}
                    </MyTag>
                  )
                }
              </div>
            </div>
          )
        }
      </Modal>
    );
  }
}

Component.propTypes = propTypes;

export default Component;
