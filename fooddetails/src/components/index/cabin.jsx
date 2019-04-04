import React from 'react';
import { Spin, message } from 'antd';
import Internet from '../common/offLineHandler';
// import { Food } from './food'//食物组件
import Food from '../common/FoodItem.jsx'//食物组件
import { compareDown } from '../../arrSort'
import http from '../../server'
import DataNone from '../common/dataNone.jsx';//无结果展示组件
import { delArr, findArr } from '../common/commonFn';
const foodStyle = {
  picStyle: {
    margin: '0 auto',
    marginTop: '0.08rem',
    width: '.516rem',
    height: '.516rem',
  },
  Style: {
    width: '.84rem',
    margin: '0.03rem',
    height: '.9rem'
  },
  fontStyle: {
    // width: '.5rem',
    // margin: '0 auto',

    fontFamily: 'PingFangSC-Light',
    margin:'0 .05rem',
    fontSize: '.12rem',
    color: '#666666',
    letterSpacing: '0',
    textAlign: 'center',
    lineHeight: '0.23rem',
    height:'.23rem',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis'
  },
  fontStyle2: {
    // width: '.5rem',
    // margin: '0 auto',

    fontFamily: 'PingFangSC-Light',
    margin:'0 .05rem',
    fontSize: '.12rem',
    color: '#E92325',
    letterSpacing: '0',
    textAlign: 'center',
    lineHeight: '0.23rem',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis'
  }
}
export class Cabin extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pickList: []
    }
    this.pickSelf = this.pickSelf.bind(this);
  }
  pickSelf(foodAttr) {
    var waitList = this.state.pickList.find(item => item.id === foodAttr.id);
    if (typeof (waitList) === 'undefined') {
      var newPickList = this.state.pickList;
      newPickList.push(
        {
          id: foodAttr.id,
          name: foodAttr.name,
          picUrl: foodAttr.picUrl,
          shelfLife: foodAttr.shelfLife,
          createTime: foodAttr.createTime
        }
      )
      this.setState({
        pickList: newPickList
      }, function () {
        this.props.pickFood(this.state.pickList);
      });

    } else {//从待选列表将其删除
      this.setState({
        pickList: delArr(this.state.pickList, foodAttr.id)
      }, function () {
        this.props.pickFood(this.state.pickList);
      });
    }
  }

  render() {
    return (
      <div className="Cabin">
        <CabinFix
          foodList={this.props.foodList}
          isDelete={this.props.isDelete}
          pickSelf={this.pickSelf}
        />
      </div>
    )
  }
}

class CabinFix extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cabinList: [],
      content: [],
      cabinName: '全舱室',
      onLoading: true,
      isConected: window.navigator.onLine,
      showWarn:0
    };
    this.cabinGet = this.cabinGet.bind(this)
  }

  async cabinGet() {
    const url = `${global.constants.line_xcook}/extend-web//fridge/getConfByTypeId`;
    const params = { "typeId": global.constants.typeId }
    const res = await http.post(url, params);
    const food = compareDown(this.props.foodList, 'overDueTime');
    console.log(JSON.stringify(params))
    console.log('返回的舱室：', res);
    if(res.status===200&&res.data.data){
      window.localStorage.cabinList = JSON.stringify(res.data.data)
      var cabinList = res.data.data.cabinInfos.map((cabin, index) => {
        return {
          name: cabin.cabinName,
          cabinID:cabin.cabinID,
          key: index + 2,
          foodList: findArr(food, parseInt(cabin.cabinID))
        }
      });
      cabinList.splice(0, 0, {
        name: '全舱室',
        key: 1,
        foodList: food
      });
      console.log('排查', cabinList)
      this.setState({
        cabinList: cabinList,
        content: cabinList.find(i => i.name === this.state.cabinName).foodList
      }, () => {
        this.setState({
          onLoading: false
        });
        console.log('该冰箱有的舱室：', this.state.cabinList)
      });
    }else{
      const cabinList=[
        {
          name: '全舱室',
          key: 1,
          foodList: food
        },
        {
          name: '冷冻室',
          key: 2,
          foodList: findArr(food,2)
        },
        {
          name: '冷藏室',
          key: 3,
          foodList: findArr(food,1)
        }
      ]
      this.setState({
        cabinList: cabinList,
        content: cabinList.find(i => i.name === this.state.cabinName).foodList
      });
         this.setState({
          onLoading: false
        });
    }

  }

  changeContent = (e, content, name) => {
    // window.navigator.onLine?message.success('网络连接成功!'):message.error('网络连接失败!');//监听网络连接
    this.setState({
      isConected: window.navigator.onLine
    });
    console.log('内容', e.currentTarget.parentNode.children);
    const lt = e.currentTarget.parentNode.children;
    for (var i = 0; i < lt.length; i++) {
      lt[i].className = ''
    }
    e.currentTarget.className = 'activeCabin'
    this.setState({
      content,
      cabinName: name
    });
  }
  componentWillReceiveProps(nextProps) {
    //如果食材待选列表收到了食材更新信息就把食材列表对应的食材进行更新
    if (nextProps.foodList !== this.props.foodList) {
      this.cabinGet()
    }
  }


  showW=()=>{
    this.setState({
      showWarn:this.state.showWarn+1
    })
  }

  render() {
    if (this.state.onLoading) {
      return (
        <>
         <div className={this.state.showWarn>5?'warningTXT':'none'}>上一页:{document.referrer}</div>
        <div className={this.state.showWarn>5?'warningTXT':'none'}>token:{window.localStorage.tokenData}</div>
        <div className={this.state.showWarn>5?'warningTXT':'none'}>global:{JSON.stringify(global.constants)}</div>
        <div className="SpinCabinFood">
          <div className="SpinTit" onClick={this.showW}>冰箱食材加载中</div>
          <Spin size="large" title="冰箱食材加载中"/>
        </div>
        </>
      )
    }
    return (
      <div className="CabinFix">
        <ul>
          {this.state.cabinList.map((todo, index) => {
            return <li  className={todo.name==='全舱室'?'CabinMain':null} key={index} onClick={(e) => this.changeContent(e, todo.foodList, todo.name)}>{todo.name}<div></div></li>
          })}
        </ul>
        {this.state.isConected?<div className="CabinFoodList">
            {this.state.content.length !== 0 ?
              <div key={0} className={this.state.content.length !== 0 ? 'foodDiv' : 'none'}>
                <Food
                  cabinList={this.state.cabinList}
                  foodList={this.state.content}
                  foodStyle={foodStyle}
                  isBarShow={true}
                  pickSelf={this.props.pickSelf}
                  father={'cabin'}
                  isDelete={this.props.isDelete} />
              </div>
              :
              <div>
                <DataNone/>
              </div>
            }
        </div>: <Internet/>}

      </div>
    )


  }
}