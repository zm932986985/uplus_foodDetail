
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Main from '../components/index/main';
import Add from '../components/addFood/index';
import Detail from '../components/index/Details';
// 如果是大型项目，router部分就需要做更加复杂的配置
// 参见 https://github.com/reactjs/react-router/tree/master/examples/huge-apps

class RouterMap extends React.Component {
    render() {
        return (
            <BrowserRouter>
            <div className="App">
              <Route exact path='/' component={Main} />
              <Route path='/Add/:token' component={Add} />
              <Route path='/Detail' component={Detail} />
            </div>
          </BrowserRouter>
        )
    }
}

export default RouterMap;