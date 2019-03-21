import React from 'react';
import { Tabs } from 'antd';
// import { Food } from './food'//食物组件
import Food from '../common/FoodItem'//食物组件
import { compareDown } from '../../arrSort'
import http from '../../server'
const TabPane = Tabs.TabPane;//舱室

function callback(key) {
  // console.log(key);
}
const foodStyle = {
  picStyle: {
    'margin': '0 auto',
    'marginTop': '0.1rem',
    'width': '0.78rem',
    'height': '0.78rem',
    'borderRadius': '.5rem',
    'border': '.01rem solid lightgray'
  },
  Style: {
    'width': '1rem',
    'margin': '0.1rem',
    'height': 'auto'
  }
}
export class Cabin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pickList: [],
      cabinList: []
    }
    this.pickSelf = this.pickSelf.bind(this);
  }

  async cabinGet() {
    const url = '/uplus/extend-web//fridge/getConfByTypeId';
    const params = { "typeId": "111c120024000810010200618005094201000000000000000000000000000000" }
    const res = await http.post(url, params);
    console.log('该冰箱有的舱室：', res.data.data.cabins)
    const food = compareDown(this.props.foodList, 'overDueTime');
    var cabinList = res.data.data.cabins.map((cabin, index) => {
      return {
        name: cabin.name,
        key: index + 2,
        foodList: findArr(food, nameToLocation(cabin.name))
      }
    });
    cabinList.splice(0, 0, {
      name: '全舱室',
      key: '1',
      foodList: food
    });
    // console.log('看看成果',cabinList);
    this.setState({
      cabinList: cabinList
    });
  }
  pickSelf(foodAttr) {
    console.log('你没有c',foodAttr)
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
  componentWillReceiveProps(nextProps) {
    //如果食材待选列表收到了食材更新信息就把食材列表对应的食材进行更新
    if (nextProps.foodList !== this.props.foodList) {
 
        this.cabinGet()

    }
  }
  componentDidMount() {
    this.cabinGet();//查询该冰箱拥有的舱室
  }
  render() {
    if (this.props.foodList.length !== 0 && this.state.cabinList !== []) {
      return (
        <Tabs className="Cabin" defaultActiveKey="1" onChange={callback} size="small">
          {this.state.cabinList.map((todo, index) => {
            return (
              <TabPane tab={todo.name} key={todo.key}>
                <Food
                  foodList={todo.foodList}
                  foodStyle={foodStyle}
                  isBarShow={true}
                  pickSelf={this.pickSelf}
                  father={'cabin'}
                  isDelete={this.props.isDelete} />
              </TabPane>
            )
          })}
        </Tabs>
      )
    }
    return null;
  }
}

function findArr(arr, attr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].location === attr) {
      newArr.push(arr[i])
    }
  }
  return newArr;
}




//根据指定的字段删除数组对象的对应对象
function delArr(arr, iden) {
  var id = iden;//要删除的id
  var array = arr;
  var newArr = array.filter(function (obj) {
    return id !== obj.id;
  });
  return newArr;
}




function nameToLocation(name) {
  // 1： 冷藏室
  // 	2： 冷冻室1
  // 	3： 冷冻室2
  // 	4： 变温室
  // 	5： 左变温室
  // 	6： 右变温室
  // 	7： 上变温室
  // 	8： 下变温室
  // 	9： 007多功能变温室
  // 	10：小变温室
  // 	11：大变温室
  // 	12：冷冻室
  // 	13：上冷冻室
  // 	14：下冷冻室
  // 	15：左冷冻室
  // 	16：右冷冻室
  // 	17：保湿室
  // 	18：冷冻变温室
  // 	19：冷藏变温室
  // 	20：保湿室
  var location = -1;
  switch (name) {
    case '冷藏室':
      location = 1;
      break;
    case '冷冻室1':
      location = 2;
      break;
    case '冷冻室2':
      location = 3;
      break;
    case '变温室':
      location = 4;
      break;
    case '左变温室':
      location = 5;
      break;
    case '右变温室':
      location = 6;
      break;
    case '上变温室':
      location = 7;
      break;
    case '下变温室':
      location = 8;
      break;
    case '007多功能变温室':
      location = 9;
      break;
    case '小变温室':
      location = 10;
      break;
    case '大变温室':
      location = 11;
      break;
    case '冷冻室':
      location = 12;
      break;
    case '上冷冻室':
      location = 13;
      break;
    case '下冷冻室':
      location = 14;
      break;
    case '左冷冻室':
      location = 15;
      break;
    case '右冷冻室':
      location = 16;
      break;
    case '保湿室':
      location = 17;
      break;
    case '冷冻变温室':
      location = 18;
      break;
    case '冷藏变温室':
      location = 19;
      break;
    case '保湿':
      location = 20;
      break;

    default:
      location = -1;
  }
  return location;
}