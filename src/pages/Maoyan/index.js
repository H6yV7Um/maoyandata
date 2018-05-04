import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'antd';
import { region_type } from './constant';
import * as actions from './actions';
import Toolbar from './Modules/Toolbar';
import MaoyanTable from './Modules/MaoyanTable';
import './index.less'

class Maoyan extends Component {
  componentDidMount () {
  }
  render() {
    const { table: {data, total, loading }} = this.props.maoyan.toJS();
    const {changeTable,changeLoading}=this.props;
    console.log(data,loading,'loading')
    return (
      <div className="maoyan">
        <Toolbar 
            changeTable={changeTable}
            changeLoading={changeLoading}
            loading={loading}
        />
        <MaoyanTable 
            config={data}
            data={data.list}
        />
      </div>
    );
  }
}

export default connect(
  state =>({
    maoyan: state.maoyan,
  }), actions
)(Maoyan);
