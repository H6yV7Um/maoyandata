import React, {Component} from 'react';
import {
    Modal,
    Form,
    Button,
    Input,
    Select,
    Table,
    Col,
    Row,
    DatePicker,
    message
} from 'antd';
import moment from 'moment';
import {getFetch, postFetch} from '../../../utils/fetch';
import * as actions from '../actions';
import {region_type, getTableList} from '../constant';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
};
const solidSearch={
    uuid: "519370BC73A1F0C95399568C5C4EA675F8E5144B0B02FC55038C835A8E199203",
    utm_source: "AppStore",
    utm_term: 4.9,
    utm_content: "519370BC73A1F0C95399568C5C4EA675F8E5144B0B02FC55038C835A8E199203",
    version_name: 4.9,
    utm_medium: "iphone",
    movieBundleVersion: 100,
    utm_campaign: "AmovieproBmovieProH0",
    __reqTraceID: "4AE0CDCC-44F5-40D4-A6FD-43BE804B15D4",
    language: "zh",
    pushToken: "dpsheb4384a270f1ae1f25a26933f921780aitpu",
    ci: 0,
    client: "iphone"
}

const mapDispatchToProps = dispatch => {
    return {
        changeTable: (data, bool = true) => {
            dispatch(actions.changeTable(data, bool))
        }
    }
}
@Form.create()
class Toolbar extends Component {
    state = {
        timeString:moment().format('YYYYMMDD')
    };
    componentDidMount() {
        this.fetchTableData();
    }
    onChange = (date, dateString) => {
        console.log(date, dateString);
        this.setState({
            timeString:dateString
        })

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.fetchTableData();
    }

    fetchTableData = () => {
        const {changeTable} = this.props;
        const {timeString}= this.state;
        
        this.props.form.validateFields((err, values) => {
            // console.log(timeString,'timeString')
            
            const paramsObj = Object.assign({}, {
                cityTier: values.cityTier?values.cityTier:0,
                typeId: 0,
                date: moment(timeString).format('YYYYMMDD'),
                cityId: 0
            },solidSearch);
            console.log(paramsObj,'paramsObj')
            getFetch(getTableList, paramsObj).then((data) => {
            if (data.data.success && data.data.success === false) return
            changeTable(data.data.data, false)
        });
    });
    }

    handleReset = () => {
        this.props.form.resetFields();
        this.setState({timeString:moment().format('YYYYMMDD')})
        this.fetchTableData()
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {timeString}= this.state;
        const dateFormat = 'YYYY-MM-DD';
        return (

            <div className="maoyan-toolbar">
                <Form onSubmit={this.handleSearch} layout="inline">
                    <Row>
                        <FormItem {...formItemLayout} label="城市">
                            {getFieldDecorator('cityTier', {initialValue: '0'})(
                                <Select
                                    style={{width: "120px"}}>
                                    {Object.keys(region_type).map((item) => <Option value={item} key={item}>{region_type[item]}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="日期">
                            {getFieldDecorator('date', {initialValue:moment(timeString, dateFormat),required:true })(
                                <DatePicker
                                format={dateFormat}
                                onChange={this.onChange}/>
                            )}
                        </FormItem>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{marginLeft: 10}}
                            onClick={this.handleSearch}
                            >
                            搜索
                            </Button>
                        <Button
                            style={{marginLeft: 10}}
                            onClick={this.handleReset}>
                            重置
                        </Button>
                    </Row>
                </Form>

            </div>
        );
    }
}

export default Toolbar;