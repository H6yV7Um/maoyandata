import React, { Component } from 'react';
import {getProductOption,getAllProductOption,grandType} from './PriceUtils';
import { Select,Col,Row } from 'antd';
const Option = Select.Option;

const initialVal = {
}
class GrandSelect extends Component {
    constructor(props) {
        super(props);
        const val = props.value || initialVal;
        this.state = {
            level: val.level,
            grand: val.grand
        }
    }
    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
          const value = nextProps.value || initialVal;
          this.setState({
              level: value.level,
              grand: value.grand,
            });
        }
    }
    changePriceLevel = (val) => {
        this.triggerChange({level: val});
    }
    changeGrandtype = (val) => {
        let temp = '';
        for (var key in grandType) {
          if (grandType[key][val]) {
            temp = key;
            this.setState({
                level: key
            })
          }
        }
        this.triggerChange({level: temp,grand: val});
    }
    triggerChange = (changedValue) => {
        
        const onChange = this.props.onChange;
        onChange && onChange(changedValue);
        
    }
    render() {
        const {level,grand} = this.state;
        const  {helpbuy,inrow,disabled} = this.props;
        return (
        <div>
            {inrow ? <Row><Col span={12}><Select
                onChange={this.changePriceLevel} 
                value={level}
                placeholder="请选择运单星级"
                style={{width:200}} disabled={disabled}>
                <Option value='1'>一星运单</Option>
                <Option value='2'>二星运单</Option>
                <Option value='3'>三星运单</Option>
                {helpbuy ? <Option value='11'>帮买帮送</Option> : null}
            </Select></Col>
            <Col span={12}>{level === '11' ? null : <Select
                placeholder="请选择标品"
                value={grand}
                onChange={this.changeGrandtype}
                style={{width:200}} disabled={disabled}>
              {level ? getProductOption(level) : getAllProductOption()}
            </Select>}</Col>
            </Row> : <div>
            <Select
                onChange={this.changePriceLevel} 
                value={level}
                placeholder="请选择运单星级" disabled={disabled}>
                <Option value='1'>一星运单</Option>
                <Option value='2'>二星运单</Option>
                <Option value='3'>三星运单</Option>
                {helpbuy ? <Option value='11'>帮买帮送</Option> : null}
            </Select>
            {level === '11' ? null : <Select
                placeholder="请选择标品"
                value={grand}
                onChange={this.changeGrandtype}
                style={{marginTop: 5}} disabled={disabled}>
              {level ? getProductOption(level) : getAllProductOption()}
            </Select>}
            </div>}
        </div>
    );
    }
}

GrandSelect.defaultProps = {
    helpbuy: false,// 默认没有帮买帮送
    inrow: true, // 默认单行
    disabled: false
}

export default GrandSelect;