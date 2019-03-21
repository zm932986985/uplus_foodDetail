//舱室总食材页面
import { PageHeader, message } from 'antd';//插件库
import React from 'react';
import http from '../../server'//接口封装
import { Cabin } from './cabin'//舱室切换组件
import { DealFood } from './dealFood'//处理食材组件
//冰箱参数
const deviceId = '28ede01fdd56';//某台611设备Id


class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      token: window.localStorage.getItem('token'),
      foodList: [],
      pickList: [],
      isUpdate: false,
      isDelete:false
    }
    this.pickFood = this.pickFood.bind(this);
    this.dropFood = this.dropFood.bind(this);
  }

  //调用接口获取access_token字段
  async getToken() {
    const res = http.post('/test/service/access?grant_type=client_credentials&client_id=unilife_standard_api_haier&client_secret=unilife_standard_api_haier_123456');
    res.then((res) => {
      window.localStorage.setItem('token', res.data.access_token)
    });
  }

  //获取全部舱室的现有食材接口
  async foodGet() {
    const res = await http.post(
      `/app/service/v1/food/getList?access_token=${window.localStorage.getItem('token')}`,
      { "deviceId": deviceId, "location": -1 }
    );
    if (typeof res.data.data !== 'undefined') {
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
            createTime:food.createTime,
            dateOfProduct: food.dateOfProduct
          }
        })
      });
      console.log('获取全部舱室食材结果', res)
    }

  }

  //调用食材批量处理接口，删除食材
  async delFromCabin(pickList) {
    console.log('你需要删的东西',pickList);
    if (pickList.length !== 0) {
      var uploadList = pickList.map((food, index) => {
        return {
          createTime: food.createTime,
        }
      });
      const res = await http.post(
        `/unilife/service/v1/food/batchFridgeFoods?access_token=${window.localStorage.getItem('token')}`,
        { deviceId: deviceId, delFridgeFoods: uploadList });
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

  //执行删除食材方法的函数
  dropFood() {//删除食材
    this.setState({
      isDelete:!this.state.isDelete
    });
    if(this.state.isDelete){
      this.delFromCabin(this.state.pickList)//删除操作
    }else{
      console.log('你现在不能删东西')
    }
  }

  //组件生命周期函数componentDidMount，可以挂在页面服务调用
  componentDidMount() {
    this.getToken();//获取token字段
    setTimeout(() => {//由于需要getToken的结果作为字段，所以需要延后执行
      this.foodGet();//获取到token字段之后，查询所有舱室的食物
    }, 100)

  }

  render() {
    if (window.localStorage.getItem('token') !== '') {
      return (
        <div>
          <PageHeader
            onBack={() => null}
            title="食材管理"
            subTitle=""
          />
          {this.state.foodList !== '' ? 
          <Cabin
            isDelete={this.state.isDelete}
            foodList={this.state.foodList}
            token={window.localStorage.getItem('token')}
            pickFood={this.pickFood}
            dropFood={this.dropFood}
          /> : null}
          <DealFood
            isDelete={this.state.isDelete}
            dropFood={this.dropFood}
            pickList={this.state.pickList}
            token={window.localStorage.getItem('token')}
          />
        </div>
      );
    }
    return null;
  }
}
export default Main;


//计算保质期剩余方法
function figTime(shelfLife, dateOfProduct) {
  // 接口返回：
  // dateOfProduct（时间戳）
  // shelfLife（保质期：天）

  // 计算保质期时间戳：shelfLifeTime（保质期对应的时间戳） = shelfLife*24*60*60*1000

  // 计算过期时间：overDueTime（过期时间戳）=dateOfProduct+shelfLifeTime

  // 获取当前时间戳：currentTime（当前时间戳） = new Date().getTime();

  // 计算百分比：(|currentTime-overDueTime|)/shelfLifeTime

  // 排序：overDueTime越小在越前面
  const shelfLifeTime = shelfLife * 24 * 60 * 60 * 1000;//保质期对应的时间戳
  const overDueTime = dateOfProduct + shelfLifeTime;//过期时间戳
  const currentTime = new Date().getTime();//当前时间戳
  const percent = (overDueTime - currentTime < 0 ? 0 : overDueTime - currentTime) / shelfLifeTime * 100;
  return { percent: percent, overDueTime: overDueTime };
}