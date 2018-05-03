import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Button, Select, Table, Input, message } from 'antd';
import * as actions from './actions';
import { columns, getTableList, getCityList, recordState } from './constant';
import { getFetch } from '../../utils/fetch';
import { isNumber } from '../../utils/verify';
import './index.less';
import EditModal from './EditModal.js';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const mapDispatchToProps = dispatch => {
  return {
    changeTable: (data = { config: [], total_count: 0 }, bool = true) => {
      dispatch(actions.changeTable(data, bool))
    },
    changeLoading: (bool = true) => {
      dispatch(actions.changeLoading(bool))
    },
    showEditModal: (show, data) => {
      dispatch(actions.showEditModal(show, data))
    }
  }
}

class Weathertag extends Component {
  state = {
    expand: false,
    selectedRowKeys: [],
    totalCallNo: 0,
    selectedRows: [],
    cityList: []
  };
  componentDidMount() {
    this.fetchTableData();
    this.searchCitylist();
  }

  fetchTableData = (params) => {
    const { changeTable, changeLoading } = this.props;
    changeLoading();
    const paramsObj = Object.assign({}, { type: 0, page_size: 20, page_now: 1 }, params || {});
    getFetch(getTableList, paramsObj).then((data) => {
      if (data.code && data.code === 'ERR') return
      data.data.page = paramsObj.page_now;
      changeTable(data.data, false)
    });
  }

  changePages = (page) => {
    this.setState({ selectedRowKeys: [], selectedRows: [] });
    this.props.form.validateFields((err, values) => {
      for (let i in values) {
        if (values[i].length === 0 || (i === "city_name" && values[i] === '全部')) {
          delete values[i]
        }
      }
      values.page_now = page;
      this.fetchTableData(values);
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      for (let i in values) {
        if ((values[i].length === 0) || (i === "city_name" && values[i] === '全部')) {
          delete values[i]
        }
      }
      values.page_now = 1;
      //console.log('Received values of form: ', values);
      this.fetchTableData(values);
    });
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;
    //console.log(selectedRowKeys, selectedRows);
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);
    onSelectRow && onSelectRow(selectedRows);
    this.setState({ selectedRowKeys, totalCallNo, selectedRows });
  }

  handleOutput = () => {
    const { changeLoading } = this.props;
    let selectids = this.state.selectedRows;
    let ids = selectids.map(item => item.grid_id).join(',')
    //console.log(selectids, ids, 'selectids==')
    changeLoading()
    const paramsObj = Object.assign({}, { type: 1, ids: ids } || {});
    getFetch(getTableList, paramsObj).then((data) => {
      if (data.code && data.code === 'ERR') return
      window.location.href = data.data.download_url;
      message.success('导出成功！')
      changeLoading(false);
    });

  }

  handleOpall = () => {
    const { changeLoading } = this.props;
    changeLoading();
    this.props.form.validateFields((err, values) => {
      for (let i in values) {
        if (values[i].length === 0 || (i === "city_name" && values[i] === '全部')) {
          delete values[i]
        }
      }
      const paramsObj = Object.assign({}, { type: 2 }, values || {});
      getFetch(getTableList, paramsObj).then((data) => {
        if (data.code && data.code === 'ERR') return
        window.location.href = data.data.download_url;
        message.success('导出全部成功！')
        changeLoading(false);
      });
    });
  }

  handleEdit = (e) => {
    const { showEditModal } = this.props;
    e.preventDefault();
    showEditModal(true, {})
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  checkIsNumber = (rule, value, callback) => {
    if (isNumber(value)) {
      callback('请输入正确的网格ID');
    } else {
      callback();
    }
  }

  searchCitylist = () => {
    getFetch(getCityList).then((data) => {
      if (data.code && data.code === 'ERR') return
      this.setState({
        cityList: [{ name: '全部', id: '' }, ...data.data]
      })
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys } = this.state;
    const tableData = this.props.weathertag.get('table');
    const toolbar = this.props.weathertag.get('toolbar');
    const pagination = {
      total: tableData.get('total'),
      onChange: this.changePages,
      pageSize: 20,
      current: tableData.get('page'),
      defaultCurrent: 1,
      showTotal: (total, range) => `共 ${total} 条,显示第${range[0]}到第${range[1]}项`
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange
    };

    return (
      <div className="weatherTag">
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
          layout="inline"
        >
          <Row>
            <FormItem {...formItemLayout} label="记录名称">
              {getFieldDecorator('alias_name', { initialValue: '' })(
                <Input placeholder="请输入记录名称" />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="城市">
              {getFieldDecorator('city_name', { initialValue: '' })(
                <Select
                  showSearch
                  style={{ width: 120 }}
                  placeholder="请选择城市"
                  optionFilterProp="children"
                  onFocus={this.searchCitylist}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {(this.state.cityList).map((item, index) =>
                    <Option key={index} value={item.name}>
                      {item.name}
                    </Option>
                  )}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="网格ID">
              {getFieldDecorator('grid_id', { initialValue: '' })(
                <Input placeholder="请输入网格ID" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="创建人">
              {getFieldDecorator('operator', { initialValue: '' })(
                <Input placeholder="请输入创建人" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="状态">
              {getFieldDecorator('status', { initialValue: '' })(
                <Select style={{ width: "120px" }}>
                  {Object.keys(recordState).map((item) =>
                    <Option value={item} key={item}>{recordState[item]}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'left' }}>
              <Button type="primary" htmlType="submit" loading={toolbar.get('loading')}>搜索</Button>
              <Button style={{ marginLeft: 10 }} onClick={this.handleReset}>
                重置
            </Button>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              {
                (selectedRowKeys.length > 0) ? (
                  <Button type="primary" style={{ marginLeft: 10 }} onClick={() => this.handleOutput()}>导出选中网格</Button>
                ) : ('')
              }
              <Button type="primary" style={{ marginLeft: 10 }} onClick={() => this.handleOpall()}>导出所有{tableData.get('total')}条网格</Button>
              <Button type="primary" style={{ marginLeft: 10 }} onClick={(e) => this.handleEdit(e)}>修改天气标签</Button>
            </Col>
          </Row>
          <Row>
            {(this.state.selectedRows.length > 0) ? (
              <div>已选中本页{this.state.selectedRows.length}条记录</div>
            ) : ('')
            }
          </Row>
        </Form>

        <Table
          dataSource={tableData.get('data').toJS ? tableData.get('data').toJS() : tableData.get('data')}
          columns={columns}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          loading={tableData.get('loading')}
          pagination={pagination}
        />

        <EditModal
          show={this.props.weathertag.get('editmodal').get('show')}
          data={this.props.weathertag.get('editmodal').get('data')}
          actions={this.props}
        />

      </div>
    );
  }
}

export default connect(
  state => ({
    weathertag: state.weathertag,
  }), mapDispatchToProps
)(Form.create()(Weathertag));

