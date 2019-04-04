// 添加食材主页
import React from 'react';
import Kind from './kind.jsx';//分类列表
import {setProps} from '../common/commonFn'
class Add extends React.PureComponent {
  render() {
    return (
      <div className="Add">
        <Kind
          location_query={setProps(this.props,'Add_')}
          token={setProps(this.props,'Add_').token}
        />
      </div>
    );
  }
}

export default Add;
