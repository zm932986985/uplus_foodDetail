
import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Main from '../components/index/main.jsx';
import Add from '../components/addFood/index.jsx';
import Detail from '../components/index/Details.jsx';
import Demo from '../example'
// 如果是大型项目，router部分就需要做更加复杂的配置
// 参见 https://github.com/reactjs/react-router/tree/master/examples/huge-apps

class RouterMap extends React.Component {
    render() {
        return (
          <div>
            <HashRouter basename='/'>
            <div className="App">
              <Route exact path='/' component={Main} />
              <Route path='/Add' component={Add} />
              <Route path='/Detail' component={Detail} />
              <Route path='/Demo' component={Demo} />
              {/* <Route path='/UploadPic' component={UploadPic} /> */}
            </div>
          </HashRouter>
          </div>
        )
    }
}

export default RouterMap;