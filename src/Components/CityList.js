import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import {city} from './city';
const Option = Select.Option;

class CityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: props.value,
      optionArr: [],
      placeholder: '请选择城市'
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({city: value});
    }
  }
  componentDidMount() {
    let _cityList = !!window.city_list.length ? window.city_list : city;
    const domArr = _cityList.map(i=><Option value={i.id} key={i.id}>{i.name}</Option>);
    this.props.all && domArr.unshift(<Option value="" key="ALL">全部</Option>);
    this.setState({optionArr: domArr});
  }
  handleCityChange = (value) => {
    if (!('value' in this.props)) {
      this.setState({ city:value });
    }
    this.triggerChange(value);
  }
  triggerChange = (changedValue) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }
  handleFocus = () => {
    this.setState({placeholder: '输入搜索...'});
  }
  handleBlur = () => {
   this.setState({placeholder: '请选择城市'}); 
  }
  render() {
    const {optionArr,city,placeholder} = this.state;
    const {all,size,disabled,style,multi} = this.props;
    return (
      <div className="citylist">
        <Select
          mode={multi ? "multiple" : '-'}
          showSearch
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          optionFilterProp="children"
          value={city}
          size={size}
          disabled={disabled}
          onChange={this.handleCityChange}
          placeholder={placeholder}
          style={style}
        >
          {optionArr}
        </Select>
      </div>
    );
  }
}

CityList.propTypes = {
  all: PropTypes.bool,
  size: PropTypes.string,
  disabled: PropTypes.bool,
};

CityList.defaultProps = {
  all: true,
  disabled: false,
  multi: false
};

export default CityList;