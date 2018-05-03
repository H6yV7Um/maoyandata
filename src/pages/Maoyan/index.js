import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'antd';
import { region_type } from './constant';
import * as actions from './actions';
import Toolbar from './modules/Toolbar';
import MaoyanTable from './modules/MaoyanTable';
import './index.less'

class Maoyan extends Component {
  componentDidMount () {
  }
  render() {
    const { table: {data, total, loading }} = this.props.maoyan.toJS();
    const {changeTable}=this.props;
    return (
      <div className="maoyan">
        <Toolbar 
            changeTable={changeTable}
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
