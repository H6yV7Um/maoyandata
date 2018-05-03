import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import rootReducer from './reducers';
import Main from './pages/Main';

// import Weathertag from './pages/Weathertag';
import Maoyan from './pages/Maoyan';

import 'moment/locale/zh-cn';
import 'antd/dist/antd.less';
import './index.less';


import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

const storeFactory = (initialState) => {
  return (rootReducer, rootSaga) => {
    const store = createStore(rootReducer, initialState, compose(
      window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
    return store;
  };
}

const maping = {
  '#/maoyandata': '猫眼院线数据',
  "#/": '猫眼院线数据'
}
document.title = maping[window.location.hash] || '猫眼数据';

const store = storeFactory()(rootReducer);

ReactDOM.render(
  <LocaleProvider locale={zhCN}><Provider store={store}>
    <Router>
      <Main>
        <Route path="/" exact component={Maoyan} />
        <Route path="/maoyandata" component={Maoyan} />
      </Main>
    </Router>
  </Provider></LocaleProvider>,
  document.getElementById('root')
);

// registerServiceWorker();