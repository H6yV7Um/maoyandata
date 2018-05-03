import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { connect } from 'react-redux';

/**
 * 组件属性说明
 *
 * @property {string} title 表头名字
 * @property {string} id 表头唯一的key
 * @property {string} queryActionType 请求接口的action type
 * @property {string} keyActionType 修改sort_key的action type
 * @property {string} loadingActionType 表格loading true的action type
 *
 *  另外 使用此组件 reducer 里需有以下状态,
 *  pgSize 非必需  一页多少数据, 不传默认20
 *  sortKey   必需    表头唯一key, 决定按哪个表头排序，
 *  isDesc    必需    是否降序排序, true降序,false升序
 *
 * reducer:
 *  case 'changeSortKey':
      const { payload: { sortKey, isDesc } } = action;
      return {
        ...state,
        sortKey: sortKey,
        isDesc: isDesc,
      }
 *
 * case 'tableLoadingTrue':
      return {
        ...state,
        isLoading: true,
      }
 */

const propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  queryActionType: PropTypes.string.isRequired,
  keyActionType: PropTypes.string.isRequired,
  loadingActionType: PropTypes.string,
};

const resetIconSty = {
  color: '#1890ff',
  cursor: 'pointer',
  marginRight: 4
};

const btnStyle = {
  color: "#1890ff",
  backgroundColor: "transparent",
  outline: "none",
  cursor: "pointer",
};

/**
 * 表头排序
 */
class Component extends React.Component {

  render() {
    const {
      // props
      title, id, queryActionType, keyActionType, loadingActionType,
      // 使用此组件需要 reducer 里有以下3个状态,
      pgSize, sortKey, isDesc, searchField,
      // 此组件内部方法
      onSortList, onClearSort
     } = this.props;

    return (
      <span>
        <span>
          {
            sortKey === id &&
            <Icon style={resetIconSty} type="reload" onClick={
              () => onClearSort({ queryActionType, keyActionType, loadingActionType, pgSize, searchField })
            } />
          }
        </span>
        <span style={btnStyle} onClick={
          () => onSortList({ queryActionType, keyActionType, loadingActionType, id, isDesc, pgSize, searchField })
        }>
          {title || ''}
          {
            sortKey === id &&
            (isDesc ? <Icon type="arrow-down" /> : <Icon type="arrow-up" />)
          }
        </span>
      </span>
    );
  }
}

Component.propTypes = propTypes;

/**
 * @param {string} reducer reducer的字符串名称, 其reducer里需定义 pgSize,sortKey,isDesc三个状态
 * @param {function} queryFunc 请求列表的接口
 * @return {function} 返回方法，接口reducer和请求接口，执行该方法后返回表头排* 序组件
 */
export default (reducer, queryFunc) => connect(
  ({ [reducer]: { pgSize, sortKey, isDesc, searchField } }) => {
    return {
      pgSize, sortKey, isDesc, searchField
    };
  },
  dispatch => ({
    //sort_key=fieldName:1 (0表示降序desc, 1表示升序asc)
    onSortList(parameter) {
      const { queryActionType, keyActionType, loadingActionType, id, isDesc, pgSize, searchField } = parameter;

      dispatch({
        type: keyActionType,
        payload: { sortKey: id, isDesc: !isDesc }
      });

      const stKey = id + ':' + (!isDesc ? 0 : 1);

      let param = {
        page_now: 1,
        page_size: pgSize || 20,
        sort_key: stKey,
      };
      if(searchField) {
        param = {
          ...param,
          ...searchField
        }
      }

      if (loadingActionType) {
        // loading true
        dispatch({
          type: loadingActionType,
          payload: true
        })
      }
      // 有排序的请求
      queryFunc(param).then(ret => {
        if (ret.code !== 'ERR') {
          dispatch({
            type: queryActionType,
            payload: ret.data
          })
        }
      });
    },
    onClearSort(parameter) {
      const { queryActionType, keyActionType, loadingActionType, pgSize } = parameter;

      dispatch({
        type: keyActionType,
        payload: { sortKey: '', isDesc: true }
      });

      const param = { page_now: 1, page_size: pgSize || 20 };

      if (loadingActionType) {
        // loading true
        dispatch({
          type: loadingActionType,
          payload: true
        })
      }

      // 无排序的请求
      queryFunc(param).then(ret => {
        if (ret.code !== 'ERR') {
          dispatch({
            type: queryActionType,
            payload: ret.data
          })
        }
      });
    }
  })
)(Component);
