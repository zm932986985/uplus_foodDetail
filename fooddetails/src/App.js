import React from 'react';
import './App.css';
import './mobile';
import './apiName'//全局配置
import RouterMap from './router/routerMap';
// import Perf from 'react-addons-perf'
// window.Perf = Perf // 挂载到全局变量方便使用
class App extends React.Component {
  render() {
    return(
      <RouterMap/>
    )
  }
}

export default App;