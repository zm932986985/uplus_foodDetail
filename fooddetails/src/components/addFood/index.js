// 添加食材主页
import React from 'react';
// import { SerchFood } from './serchFood';
import Kind from './kind';//分类列表
import JustGo from '../common/back';
import Info from '../foodInfo/index'
class Add extends React.PureComponent {
  state = {
    isInfoShow: false,
    foodAttr: {},
    foodAttrChange:{}
  }
  openInfo = (attr) => {
    this.setState({
      isInfoShow: true,
      foodAttr: attr
    });
    console.log('待选食材信息编辑：', attr)
  }
  closeInfo = () => {
    this.setState({
      isInfoShow: false
    });
  }
  upLoadInfo=(Change)=>{
    this.setState({
      isInfoShow:false,
      foodAttrChange:Change
    });
    console.log('下发给 Kind 组件的修改信息：',Change)
  }
  render() {
    return (
      <div>
        {this.state.isInfoShow ?
          <Info
            closeInfo={this.closeInfo}
            default={this.state.foodAttr}
            upLoadInfo={this.upLoadInfo}
          /> : null}
        <JustGo title="添加食材" route="/" />
        <Kind 
        openInfo={this.openInfo} 
        token={window.localStorage.token}
        foodAttrChange={this.state.foodAttrChange}
         />
      </div>
    );
  }
}

export default Add;
