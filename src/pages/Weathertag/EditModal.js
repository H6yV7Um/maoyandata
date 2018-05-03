import React, { Component } from 'react';
import { Modal, Form, Button, Radio, notification, Input, Upload, message } from 'antd';
import { getFetch, postFetch } from '../../utils/fetch';
import { uploadFile } from './constant';
import './EditModal.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: '修改生效',
    description: '修改标签已经生效'
  });
};

class EditModal extends Component {
  state = {
    fileList: [],
    uploadData: [],
    uploading: false,
    value: 1
  }

  //////隐藏编辑页面
  hideModal() {
    const { actions } = this.props;
    actions.showEditModal(false, {})
  }
  /////////////

  handleEdit() {
    if (this.state.fileList.length === 0) {
      message.warn('请选择文件')
      return
    }
    confirm({
      title: '请确认',
      content: `是否确认更改？`,
      style: { width: 80 },
      okText: "确认",
      cancelText: "取消",
      onOk() {
        postFetch('/elezhongbao/audit/invite/approveInvite', this.state.uploadData)
          .then((data) => {
            if (data.code && data.code === 'ERR') return
            this.setState({
              uploading: false,
              uploadData: []
            })
          })
      },
      onCancel() { }
    })
  }

  handleUpload = () => {
    const { fileList, uploadData } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
      uploadData: formData
    });
  }

  render() {
    const { data, show, actions } = this.props;
    const { getFieldDecorator } = actions.form;
    const uploadlist = this.state.fileList.length;
    const props = {
      action: '//',
      accept: '.xlsx',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    }
    return (
      <div>
        <Modal
          className="editmodal"
          title="修改标签"
          visible={show}
          onCancel={() => this.hideModal()}
          onOk={() => this.handleEdit()}
          okText="确认"
          cancelText="取消"
        >
          <Upload {...props}>
            导入文件：
          {
              uploadlist > 0 ? (
                <Button disabled>选择文件</Button>
              ) : (
                  <Button>选择文件</Button>
                )}

          </Upload>

          <div className="editmodal-uploadinfo">
            格式说明：需为.xlsx文件。四列无表头，四列分别为城市名称，网格id（大物流网格id），天气标签，修改时长（分钟）。 天气标签可选项为：晴天，晴夜，多云天，多云夜，阴，风，雾，霾，高温，大雨，大雪，大冻雨，中雨，中雪，中冻雨，小雨，小雪，小冻雨，烈风，狂风，暴风，飓风
        </div>

          <div className="editmodal-example">
            <div style={{ margin: '20px 0' }}>实例表格：</div>
            <table className="editmodal-example-table">
              <tbody>
                <tr>
                  <td>上海</td>
                  <td>1103</td>
                  <td>大雨</td>
                  <td>30</td>
                </tr>
                <tr>
                  <td>上海</td>
                  <td>1104</td>
                  <td>小雨</td>
                  <td>240</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="editmodal-record">
            <Form layout="inline">
              <FormItem label='记录名称'>
                {getFieldDecorator('alias_name', {
                  rules: [{
                    required: true, message: '请填写记录名称'
                  }],
                })(
                  <Input
                    style={{ width: 400 }}
                    placeholder="记录名称可作为本次创建记录的唯一标识，供筛选使用"
                  />
                  )}
              </FormItem>
            </Form>
          </div>
          <div className="editmodal-info">
            注：如果有生效中的记录，会直接被新纪录覆盖
        </div>
        </Modal>

      </div>
    );
  }
}

export default EditModal;