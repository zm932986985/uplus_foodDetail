//舱室总食材页面
import { message, Spin } from 'antd';//插件库
import React from 'react';
import http from '../../server'//接口封装
import { Cabin } from './cabin.jsx'//舱室切换组件
import { DealFood } from './dealFood.jsx'//处理食材组件
import JustGo from '../common/back.jsx'
import { figTime } from '../common/commonFn';
import Internet from '../common/offLineHandler';
//冰箱参数
// const deviceId = '28ede01fdd56';//某台611设备Id
message.config({//全局提示最大数为1
  maxCount: 1,
});


class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      token: '',
      foodList: [],
      pickList: [],
      isUpdate: false,
      isDelete: false,
      onLoading: true,
      isConected: window.navigator.onLine,
      showWarn:0
    }
    this.pickFood = this.pickFood.bind(this);
    this.dropFood = this.dropFood.bind(this);
    this.foodGet = this.foodGet.bind(this);
  }

  //调用接口获取access_token字段
  async getToken() {
    console.log(111)
    const res = await http.post(`${global.constants.apiName}/service/access?grant_type=client_credentials&client_id=unilife_standard_api_haier&client_secret=unilife_standard_api_haier_123456`);
    console.log('token更新了！**************', res)
    if (res.status === 200) {
      //往localstorage塞token 
      window.localStorage.tokenData = JSON.stringify({
        token: res.data.access_token,
        expires_in: new Date().getTime() + (res.data.expires_in * 1000)//expires_in 的单位是秒，变成毫秒要*1000
      });

      const token = res.data.access_token;
      this.setState({ token }, () => {
        this.foodGet();//获取到token并且设置为组件状态之后调用接口，否则不调用
        console.log('组件状态token', this.state.token);
      });
    } else {
      console.log('接口调用失败，请检查', res);
    }

  }

  //获取全部舱室的现有食材接口
  async foodGet() {
    const res = await http.post(
      `${global.constants.apiName}/service/v1/food/getList?access_token=${this.state.token}`,
      { "deviceId": global.constants.mac, "location": -1 }
    );
    if (res.data.errormsg === 'success') {
      this.setState({onLoading:false});
      this.setState({
        foodList: res.data.data.map((food, index) => {
          return {
            id: food.id,
            name: food.name,
            picUrl: food.imgUrl,
            percent: figTime(food.shelfLife, food.dateOfProduct).percent,
            location: food.location,
            create: new Date(food.dateOfProduct),
            days: food.shelfLife,
            overDueTime: figTime(food.shelfLife, food.dateOfProduct).overDueTime,
            shelfLife: food.shelfLife,
            createTime: food.createTime,
            dateOfProduct: food.dateOfProduct
          }
        })
      }, () => {
        console.log('获取全部舱室食材结果', this.state.foodList);
      });
    }

  }

  //调用食材批量处理接口，删除食材
  async delFromCabin(pickList) {
    if (pickList.length !== 0) {
      var uploadList = pickList.map((food, index) => {
        return {
          createTime: food.createTime,
        }
      });
      const res = await http.post(
        `${global.constants.apiName}/service/v1/food/batchFridgeFoods?access_token=${this.state.token}`,
        { deviceId: global.constants.mac, delFridgeFoods: uploadList });
      if (res.data.errormsg === 'success') {
        message.success('食材删除成功');
        //清空待选列表
        this.setState({
          pickList: []
        });
        //更新食材列表
        this.foodGet();
      }
      console.log('删除食材结果', res)

    } else {
      message.warning('您还没有选择任何食材哟！');
    }
  }

  //把选择的食物类别添加到待选列表中，动作由 FoodKind 触发传递到 Kind 父组件
  pickFood(pickList) {
    this.setState({
      pickList: pickList
    });
  }
  cancelDel = () => {//取消删除
    this.setState({
      isDelete: false,
      pickList: []
    });
  }
  //执行删除食材方法的函数
  dropFood() {//删除食材
    this.setState({
      isDelete: true
    });
    if (this.state.isDelete) {
      this.delFromCabin(this.state.pickList)//删除操作
    } else {
      console.log('你现在不能删东西')
    }
  }


  showW=()=>{
    this.setState({
      showWarn:this.state.showWarn+1
    })
  }

  //组件生命周期函数componentDidMount，可以挂在页面服务调用,token的获取处理
  componentDidMount() {
    if (window.localStorage.tokenData) {
      const whether = new Date().getTime() < JSON.parse(window.localStorage.tokenData).expires_in;//缓存中的 expires_in 字段是否过期，true表示没过期，false表示过期
      if (whether) {//token未到期
        this.setState({
          token: JSON.parse(window.localStorage.tokenData).token,
        }, () => {
          this.foodGet();//必须等到token设置成功之后才能调用
        });
      } else {
        console.log('token已到期');
        this.getToken();//获取token字段

      }

    } else {
      this.getToken();//获取token字段
    }

  }

  render() {
    if (this.state.onLoading) {
      return (
        <>
        <JustGo title="食材管理" route="" backIndex={true} className="mainGo"/>
        <div className={this.state.showWarn>5?'warningTXT':'none'}>上一页:{document.referrer}</div>
        <div className={this.state.showWarn>5?'warningTXT':'none'}>token:{this.state.token}</div>
        <div className={this.state.showWarn>5?'warningTXT':'none'}>global:{JSON.stringify(global.constants)}</div>
        <div className="Spin">
        <span onClick={this.showW}>正在加载页面</span>
          <Spin size="large" />
        </div>
        </>

      )
    }
    return (
      <div>
      {this.state.isConected?<>
        <JustGo title="食材管理" route="" backIndex={true} className="mainGo"/>
        <Cabin
          isDelete={this.state.isDelete}
          foodList={this.state.foodList}
          token={this.state.token}
          pickFood={this.pickFood}
          dropFood={this.dropFood}
        />
        <DealFood
          isDelShow={this.state.foodList.length === 0}
          isDelete={this.state.isDelete}
          cancelDel={this.cancelDel}
          dropFood={this.dropFood}
          pickList={this.state.pickList}
          token={this.state.token}
        />
      </>:<Internet/>}
      </div>
    );
  }
}

export default Main;