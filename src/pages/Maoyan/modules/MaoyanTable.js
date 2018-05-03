import React, { Component } from 'react';
import { Modal, Form, Button, Input,Table,message,List,Card } from 'antd';
import {columns} from '../constant'
import { getFetch, postFetch } from '../../../utils/fetch';
const title=['院线名','人次','票房','场均人次','平均票价']

class MaoyanTable extends Component {
    state={
        listArr:[]
    }
    componentWillReceiveProps(nextProps){
        const {data,config}=nextProps;  
            this.setState({
                listArr:config.all,
            })
    }

  render() {
    const {data,config}=this.props
    const {listArr}= this.state;
    let arr=[]
    Object.keys(listArr).map(item=>
        arr.push(listArr[item])
    )
    const pagination = {
        pageSize: 15,
        defaultCurrent: 1,
      }

    return (
        <div>
            <p>{config.updateInfo}</p>
            <hr className="hrstyle"/>
            <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
                size="small"
                style={{marginLeft:'10%'}}
                dataSource={arr}
                renderItem={(item,index) => (
                    <List.Item> 
                        <Card title={title[index]}>{item}</Card>
                    </List.Item>
                )}
            />
             <hr className="hrstyle"/>
            <Table 
                className="maoyantable"
                columns={columns}
                dataSource={data}
                pagination={pagination}
            />
        </div>
    );
  }
}

export default MaoyanTable;