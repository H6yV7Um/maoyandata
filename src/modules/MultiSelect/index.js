import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';

import { Input, Button, Tooltip } from 'antd';
import './styles.less';

import _ from 'lodash';
/**
 * 多选组件
 *
 * 组件属性申明
 *
 * @data 下拉选框数据
 * @onChange 选择变化时的响应事件
 * @enableFiltering 是否包含检索
 * @includeSelectAllOption 是否包含全选
 * @label 标签名字，为空或false时不显示标签
 * @width select宽度，不包含标签宽度，默认150
 * @maxWord 选择的选项显示的最大字数
 */
const propTypes = {
    data: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    onMouseEnter: PropTypes.func,
    enableFiltering: PropTypes.bool,
    includeSelectAllOption: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    width: PropTypes.number,
    maxWord: PropTypes.number,
};

const ITEM_CLASS = ' ant-select-dropdown-menu-item ';
const ITEM_SELECTED_CLASS = ' ant-select-dropdown-menu-item-selected ';
const ITEM_HIDDEN_CLASS = ' hidden ';
const SELECT_DISABLED_CLASS = ' ant-select-disabled ';
const SELECT_ENABLED_CLASS = ' ant-select-enabled ';
const MAX_SHOW_TEXT = 2;
const MAX_WORD_CONT_TEXT = 10;
const DEFAULT_WIDTH = 150;

export default class MultiSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dropLabel: false,
            ...this.initFromData(props.data)
        };

        this.action = '';

        this.handleClick = (index) => {
            if (this.isChecked(index)) { // 已选，取消选择
                this.setState({
                    [index]: ITEM_CLASS
                });
            } else {
                this.setState({
                    [index]: ITEM_SELECTED_CLASS + ITEM_CLASS
                });
            }
            this.action = 'select';
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.compareProps(nextProps, this.props)) {
            return;
        }
        this.setState({
            ...this.initFromData(nextProps.data)
        })
    }
    componentDidUpdate(prevProps, prestate) {
        const { onChange } = this.props;
        if (this.action === 'select' && _.isEqual(this.props, prevProps) && this.state.selectAll === prestate.selectAll && this.state.text === prestate.text && this.state.dropLabel === prestate.dropLabel && !_.isEqual(prestate, this.state)) {
            onChange && onChange(this.getValue());
            this.updateTextAndSelectAll();
        }
    }
    compareProps(newProps, oldProps) {
        if (newProps.data && oldProps.data) {
            let newData = newProps.data;
            let oldData = oldProps.data;
            if (newData.length !== oldData.length) {
                return false;
            }
            for (let i = 0; i < newData.length; i++) {
                if (newData[i]['value'] != oldData[i]['value'] || newData[i]['selected'] != oldData[i]['selected']) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    componentDidMount() {
        this.$searchInput = $(findDOMNode(this.refs['searchInput'])).find('input');
    }
    // 初始化时获取
    initFromData(data) {
        let text = '';
        let ret = {};
        let count = 0;
        let val = [];
        let vis = [];
        this.dataMapping = {};
        for (let i = 0; i < data.length; i++) {
            this.dataMapping[data[i]['value']] = data[i]['label'];
            let id = this.getDomId(data[i]['value']);
            if (this.state && this.state[id] && this.state[id].indexOf('hidden') > -1) {
                ret[id] = data[i].selected ? ITEM_SELECTED_CLASS + ITEM_CLASS + ITEM_HIDDEN_CLASS : ITEM_CLASS + ITEM_HIDDEN_CLASS;
            } else {
                ret[id] = data[i].selected ? ITEM_SELECTED_CLASS + ITEM_CLASS : ITEM_CLASS;
                vis.push(id);
            }
            if (data[i]['selected']) {
                count++;
                val.push(id);
                if (count === data.length) {
                    text = '全部';
                } else if (count > MAX_SHOW_TEXT) {
                    text = count + '个选择';
                } else {
                    text += (count == 1 ? '' : '，') + data[i]['label'];
                }
            }
        }
        return {
            text: this.beautyText(text || '没有选择'),
            selectAll: this.isContained(val, vis),
            ...ret
        };
    }
    beautyText(text) {
        if (text.length && text.length > MAX_WORD_CONT_TEXT) {
            text = text.substring(0, this.props.maxWord || MAX_WORD_CONT_TEXT) + '..';
        }
        return text;
    }
    updateTextAndSelectAll() {
        let val = this.getValue();
        let text = '';
        let fullLength = 0;
        let selectAll;
        if (val.length === this.props.data.length) {
            text = '全部';
        } else if (val.length > MAX_SHOW_TEXT) {
            text = val.length + '个选择';
        } else {
            for (let i = 0; i < val.length; i++) {
                text += (i == 0 ? '' : ', ') + this.dataMapping[val[i]];
            }
        }

        this.setState({
            selectAll: this.isContained(val, this.getShowOptionsValue()),
            text: this.beautyText(text || '没有选择')
        })
    }
    changeLabelVisible() {
        const { dropLabel } = this.state;
        const { disabled } = this.props;
        if (disabled) {
            return;
        }
        if (dropLabel) { // 当前为展开状态，即将关闭，此时移除事件绑定
            $(document.body).off('click.multiselect');
        } else {
            $(document.body).on('click.multiselect', e => this.showLabel(e))
        }
        this.setState({
            dropLabel: !dropLabel
        })
    }
    showLabel(e) {
        const { dropLabel } = this.state;
        let $current = $(e.target);
        if ($current.closest($(findDOMNode(this.refs['multiselect']))).length <= 0) {
            $(document.body).off('click.multiselect');
            this.setState({
                dropLabel: !dropLabel
            });
        }
    }
    render() {
        const { data, includeSelectAllOption, enableFiltering, label, disabled, onMouseEnter } = this.props;
        const { selectAll, dropLabel, text } = this.state;
        const width = this.props.width || DEFAULT_WIDTH;
        return (
            <div style={{ display: 'inline-block', marginRight: 8 }}>
                {
                    label ? (<div style={{ display: 'inline-block' }}>{label}：</div>) : null
                }
                <div
                    className="ant-form-item-control"
                    ref="multiselect"
                    style={{ width: width, lineHeight: 1.5, display: 'inline-block' }}
                >
                    <div
                        className={disabled ? "ant-select ant-select-disabled" : "ant-select ant-select-enabled"}
                        onClick={() => this.changeLabelVisible()}
                        onMouseEnter={onMouseEnter}
                    >
                        <div className="ant-select-selection ant-select-selection--single">
                            <div className="ant-select-selection__rendered">
                                <div className="ant-select-selection-selected-value">{text}</div>
                            </div>
                            <span className="ant-select-arrow"></span>
                        </div>
                    </div>
                    <div
                        className="ant-select-dropdown ant-select-dropdown--multiple  ant-select-dropdown-placement-bottomLeft"
                        style={{ left: 0, top: 35, width: width, display: dropLabel ? 'block' : 'none' }}>
                        <div style={{ overflow: 'auto' }}>
                            {
                                enableFiltering ? (<Input.Group>
                                    <Input placeholder="搜索" ref="searchInput" onKeyUp={e => this.onFilter(e)} />
                                    <div className="ant-input-group-wrap">
                                        <Button style={{ 'borderTopLeftRadius': '0px', 'borderBottomLeftRadius': '0px' }} icon="search" onClick={e => this.onClickFilter(e)} />
                                    </div>
                                </Input.Group>) : null
                            }

                            {
                                includeSelectAllOption ? (<div className={selectAll ? ITEM_SELECTED_CLASS + ITEM_CLASS : ITEM_CLASS} style={{ color: '#1890ff', marginRight: data.length < 8 ? 0 : '2px' }} onClick={() => this.selectAll()}>全选</div>) : null
                            }

                            <ul className="ant-select-dropdown-menu ant-select-dropdown-menu-vertical  ant-select-dropdown-menu-root" ref="list">
                                {this.initData(data).map((item, index) => {
                                    let domId = this.getDomId(item.value);
                                    return (
                                        <Tooltip
                                            key={index}
                                            placement="right"
                                            title={item.label}
                                            trigger={item.width > width * 0.75 ? ['hover'] : []}
                                        >
                                            <li
                                                style={{ textOverflow: 'ellipsis' }}
                                                unselectable="unselectable"
                                                className={this.state[domId]}
                                                data-value={item.value}
                                                data-label={item.label}
                                                onClick={() => this.handleClick(domId)}>
                                                {item.label}
                                            </li>
                                        </Tooltip>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <div style={{ top: '0px', position: 'absolute', visibility: 'hidden', fontSize: '12px' }} id="fontCompute" />
                </div>
            </div>
        )
    }
    computeFontWidth(v) {
        if (v.length > 9) {
            let d = $('#fontCompute');
            d.html(v);
            return d.width();
        }
        return 0;
    }
    initData(data) {
        data && data[0] && !data[0].width && data.map(
            (item) => {
                item.width = this.computeFontWidth(item.label);
            }
        );
        return data;
    }
    /**
     * 由option的value值获取此dom的id
     **/
    getDomId(value) {
        return 'li-' + value;
    }
    /**
     * 由dom的id获取option的value
     **/
    getValueFromDomId(domId) {
        let m = domId.match(/^li-(.*)/);
        if (m && m[1]) {
            return m[1];
        }
        return '';
    }
    /**
     * 获得value
     **/
    getValue() {
        let value = [];
        this.props.data.forEach(
            item => {
                let key = this.getDomId(item.value);
                if (this.isChecked(key)) {
                    let id = this.getValueFromDomId(key);
                    id && value.push(id);
                }
            }
        );
        return value;
    }
    getShowOptionsValue() {
        let value = [];
        this.props.data.map(
            (item) => {
                let key = this.getDomId(item.value);
                if (!this.isHidden(key)) {
                    let id = this.getValueFromDomId(key);
                    value.push(id);
                }
            }
        );
        return value;
    }
    getAllOptionsValue() {
        let value = [];
        this.props.data.map(
            (item) => {
                let key = this.getDomId(item.value);
                let id = this.getValueFromDomId(key);
                value.push(id);
            }
        );
        return value;
    }
    /*操作的永远是可见的*/
    selectAll() {
        let selectAll = !this.state.selectAll;
        let showOptions = this.getShowOptionsValue();
        if (selectAll) { // 全选
            for (let i = 0; i < showOptions.length; i++) {
                this.checked(this.getDomId(showOptions[i]));
            }
        } else { // 全不选
            for (let i = 0; i < showOptions.length; i++) {
                this.unChecked(this.getDomId(showOptions[i]));
            }
        }
        this.action = 'select';
    }
    onFilter(e) {
        let target = e.target;
        let searchWord = target.value;
        this.filter(searchWord);
    }
    onClickFilter(e) {
        let searchWord = this.$searchInput.val();
        this.filter(searchWord);
    }
    filter(searchWord) {
        let options = this.getAllOptionsValue();
        let ret = {};
        let vis = [];
        for (let i = 0; i < options.length; i++) {
            let value = options[i];
            let label = this.dataMapping[value];
            if (label && label.indexOf(searchWord) > -1) {
                this.show(this.getDomId(value), ret);
                vis.push(value);
            } else {
                this.hide(this.getDomId(value), ret);
            }
        }
        this.setState({
            ...ret,
            selectAll: this.isContained(this.getValue(), vis)
        });
        this.action = 'filter';
    }
    isChecked(id) {
        const className = this.state[id];
        return className && className.indexOf('selected') > -1;
    }
    isHidden(id) {
        const className = this.state[id];
        return className && className.indexOf('hidden') > -1;
    }
    checked(id) {
        if (!this.isChecked(id)) {
            let className = this.state[id];
            this.setState({
                [id]: ITEM_SELECTED_CLASS + className
            });
        }
    }
    unChecked(id) {
        if (this.isChecked(id)) {
            let className = this.state[id];
            this.setState({
                [id]: className.replace(ITEM_SELECTED_CLASS, '')
            });
        }
    }
    show(id, ret) {
        if (this.isHidden(id)) {
            let className = this.state[id];
            ret[id] = className.replace(ITEM_HIDDEN_CLASS, '');
        }
    }
    hide(id, ret) {
        if (!this.isHidden(id)) {
            let className = this.state[id];
            ret[id] = className + ITEM_HIDDEN_CLASS;
        }
    }
    isContained(a, b) {
        if (a.length < b.length) {
            return false;
        }
        let aStr = a.toString();
        for (let i = 0, len = b.length; i < len; i++) {
            if (aStr.indexOf(b[i]) == -1) {
                return false;
            }
        }
        return true;
    }
}
