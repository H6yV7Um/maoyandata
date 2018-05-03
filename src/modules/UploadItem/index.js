import React from 'react';
import PropTypes from 'prop-types';
import { Upload, Button, Icon, Tooltip } from 'antd';
import './style.less';

/**
 * 组件属性说明
 *
 * @property {object} uploadProps 上传文件的props, 需有fileList
 * @property {boolean} internalBtn 是否显示上传按钮
 * @property {boolean} loading 上传loading UI展示
 * @property {function} onUpload 上传回调(如果有内部的上传按钮)
 *
 */

const propTypes = {
  uploadProps: PropTypes.object.isRequired,
  internalBtn: PropTypes.oneOf([true, false, undefined]),
  loading: PropTypes.oneOf([true, false, undefined]),
  onUpload: PropTypes.func,
};

const tipsStyle = {
  float: "right",
}

class Component extends React.Component {
  render() {
    const { uploadProps, internalBtn, loading, onUpload, tips } = this.props;

    const fileListLen = uploadProps.fileList.length || 0;

    return (
      <div className="upload-container clearfix">
        {
          internalBtn &&
          <Button
            className="upload-demo-start"
            type="primary"
            onClick={onUpload}
            disabled={fileListLen === 0}
            loading={loading || false}
          >
            上传
          </Button>
        }
        {
          tips &&
          <div style={tipsStyle}>
            <Tooltip placement="top" title={tips}>
              <Icon type="question-circle-o" />
            </Tooltip>
          </div>
        }

        <Upload {...uploadProps}>
          <Button>
            <Icon type="upload" /> 选择文件
          </Button>
        </Upload>
      </div>
    );
  }
}

Component.propTypes = propTypes;

export default Component;
