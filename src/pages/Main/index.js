import React, { Component } from 'react';
import { Spin } from 'antd';

import { getAccessData, checkPageAuth } from '../../utils/permission';

import './index.less';
import {getFetch} from '../../utils/fetch';


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  render() {
    // eslint-disable-next-line
    const { loading } = this.state;
    const { children } = this.props;
    return (
      <div className="wl_ui_layout">
        {children}
      </div>);
  }
}
export default Main;