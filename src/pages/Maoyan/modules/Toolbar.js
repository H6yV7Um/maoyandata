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
    Radio,
    message
} from 'antd';
import moment from 'moment';
import {getFetch, postFetch} from '../../../utils/fetch';
import * as actions from '../actions';
import {region_type, getTableList} from '../constant';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

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
    //TODO:月票房搜索
    state = {
        timeString:moment().format('YYYYMMDD'),
        monthString:moment().format('YYYYMM'),
        selectMonth:0,
        radioValue:0
    };
    componentDidMount() {
        this.fetchTableData();
    }
    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            radioValue: e.target.value,
        });
      }
    onDateChange = (date, dateString) => {
        this.setState({
            timeString:dateString,
            selectMonth:0
        })

    }
    onMonthChange=(date, dateString)=>{
        console.log(date, dateString);
        this.setState({
            monthString:dateString,
            selectMonth:1
        })       
    }

    disabledDate=(current)=> {
        // Can not select days after today and today
        return current && current > moment().endOf('day');
      }
      

    handleSearch = (e) => {
        const {changeLoading} = this.props;
        e.preventDefault();
        changeLoading(true)
        this.fetchTableData();
    }

    fetchTableData = () => {
        const {changeTable,changeLoading} = this.props;
        const {timeString,monthString,selectMonth,radioValue}= this.state;
        console.log(monthString,'====monthString',selectMonth,'==selectMonth',radioValue,'radioValue')
        let monthQueryString= moment(monthString).format('YYYYMMDD')
        let timeQueryString =moment(timeString).format('YYYYMMDD')
        this.props.form.validateFields((err, values) => {
            const paramsObj = Object.assign({}, {
                cityTier: values.cityTier?values.cityTier:0,
                typeId: radioValue&&radioValue==1?2:0,
                date: radioValue&&radioValue==1?monthQueryString:timeQueryString,
                cityId: 0
            },solidSearch);
            console.log(paramsObj,'paramsObj')
            getFetch(getTableList, paramsObj).then((data) => {
            if (data.data.success && data.data.success === false) return
            changeTable(data.data.data, false)
            changeLoading(false);
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
        const {loading} = this.props;
        const {timeString,radioValue}= this.state;
        const dateFormat = 'YYYY-MM-DD';
        console.log(radioValue,'===radioValue')
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
                                disabled={radioValue===1}
                                onChange={this.onDateChange}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="月份">
                            {getFieldDecorator('month', {initialValue:null,required:true })(
                                <MonthPicker 
                                    disabledDate={this.disabledDate} 
                                    placeholder="请选择月份" 
                                    disabled={radioValue===0}
                                    onChange={this.onMonthChange}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="">
                            {getFieldDecorator('check', {initialValue:0,required:true })(
                                <RadioGroup onChange={this.onChange} value={this.state.radioValue}>
                                   <Radio value={0}>按日期搜索</Radio>
                                   <Radio value={1}>按月份搜索</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>

                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{marginLeft: 10}}
                            onClick={this.handleSearch}
                            loading={loading}
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