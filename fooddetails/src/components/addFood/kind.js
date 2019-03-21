//添加食材展示列表
import React from 'react';
import { Tabs, message } from 'antd';
import http from '../../server';
import Draw from './Draw';
import Food from '../common/FoodItem';
import { SerchFood } from './serchFood';
//按钮
const TabPane = Tabs.TabPane;
const foodStyle = {
    picStyle: {
        width: '.4rem',
        height: '.4rem',
        borderRadius: '.7rem',
        border: '.01rem solid lightgray',
        margin: '0 auto'
    },
    Style: {
        width: '.6rem',
        height: '.8rem',
        padding: '.05rem',
        border: '0'
    },
    fontStyle: {
        'position': 'absolute',
        textAlign: 'center',
        fontSize: '.05rem',
        'width': '.6rem',
        left: 0
    }
}
class Kind extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_kind: [],
            pickList: []
        }
        this.pickFood = this.pickFood.bind(this);
        this.dropFood = this.dropFood.bind(this);
    }

    async getKind() {
        // const url = '/test/service/v1/food/getNewPublicFoodCatalogList?access_token=93f32b82db8e05ba68c52b5d0ef813c7'
        const url = `/test/service/v1/food/getNewPublicFoodCatalogList?access_token=${this.props.token}`
        const params = { "updateDate": 1506787200000 };
        const res = await http.post(url, params);
        console.log('冰箱目前的种类列表：', res);
        this.setState({
            data_kind: res.data.data
        });
    }

    pickFood(foodAttr) {//把选择的食物类别添加到待选列表中，动作由 FoodKind 触发传递到 Kind 父组件
        var newPickList = this.state.pickList;
        newPickList.push(
            {
                id: foodAttr.id,
                name: foodAttr.name,
                picUrl: foodAttr.picUrl,
                shelfLife: foodAttr.shelfLife,
                dateOfProduct: (new Date()).getTime(),
                createTime: (new Date()).getTime()//设置食材的生产日期默认为点击选中食材的当前日期
            }
        )
        this.setState({
            pickList: newPickList
        });
    }

    dropFood(id) {//把选择的食物从待选列表中删除，动作由 Draw 触发传递到 Kind 父组件
        this.setState({
            pickList: delArr(this.state.pickList, id)
        });
    }
    componentDidMount() {
        this.getKind();
    }
    componentWillReceiveProps(nextProps) {
        //如果食材待选列表收到了食材更新信息就把食材列表对应的食材进行更新
        if (JSON.stringify(nextProps.foodAttrChange) !== '{}') {
            this.setState({
                pickList:  updateFood( this.state.pickList,nextProps.foodAttrChange)
            }, () => {
                console.log('待选列表更新：', this.state.pickList);
                message.success('信息已修改');
            });
        }
    }
    render() {
        console.log('不知道是不是你这里', this.state.pickList)
        return (
            <div>
                <SerchFood
                    pickList={this.state.pickList}
                    pickFood={this.pickFood}
                    dropFood={this.dropFood} />
                <Draw
                    pickList={this.state.pickList}
                    dropFood={this.dropFood}
                    openInfo={this.props.openInfo}
                    token={this.props.token}
                />
                <Tabs tabPosition={"left"} >
                    {this.state.data_kind.map((todo, index) => {
                        return (
                            <TabPane
                                tab={todo.name}
                                key={index}
                                style={{ position: "relative" }}
                            >
                                <FoodKind
                                    kind={todo.id}
                                    pickFood={this.pickFood}
                                    pickList={this.state.pickList}
                                    dropFood={this.dropFood} />
                            </TabPane>
                        )
                    })}
                </Tabs>
                {/* <ButtonGroup className="DealFool1" size="large">
                    <Button onClick={this.addToCabin}>添加至冷藏室</Button>
                    <Button>添加至冷冻室</Button>
                    <Button>添加至变温室</Button>
                </ButtonGroup> */}
            </div>
        )
    }
}


class FoodKind extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            kindList: []
        }
        this.pickSelf = this.pickSelf.bind(this);
    }
    async getKindList() {
        const url = '/test/service/v1/food/getNewPublicFoodSimpleList?access_token=93f32b82db8e05ba68c52b5d0ef813c7';
        const params = { "classifyFaceId": this.props.kind };
        const res = await http.post(url, params);
        this.setState({
            kindList: res.data.data
        });
        console.log('所有种类的食材：', res);
    }
    pickSelf(foodAttr) {//食物--->待选列表（传给父组件Kind）
        var waitList = this.props.pickList.find(item => item.id === foodAttr.id);
        if (typeof (waitList) === 'undefined') {//如果是未选食材
            this.props.pickFood(foodAttr)//添加到待选列表
        } else {
            this.props.dropFood(foodAttr.id)//从待选列表中删除
        }
    }
    componentDidMount() {
        this.getKindList();
    }
    render() {
        return (
            <div style={{ padding: '.2rem 0 .7rem 0', overflowY: 'hidden' }}>
                <Food foodList={this.state.kindList} foodStyle={foodStyle} pickSelf={this.pickSelf} pickList={this.props.pickList} father={'kind'}/>
            </div>
        )
    }
}


//根据指定的字段删除数组对象的对应对象
function delArr(arr, iden) {
    var id = iden;//要删除的id
    var array = arr;
    var newArr = array.filter(function (obj) {
        return id !== obj.id;
    });
    console.log(newArr);
    return newArr;
}

//修改对象数组某个对象的属性
function updateFood(list1,changes) {
    //寻找处于数组的下标位置并修改属性
    var list = list1;
    var index = list.findIndex(function (data) {
        return data.id === changes.id;
    });
    list[index].dateOfProduct = changes.dateOfProduct//保质期作为创造时间
    list[index].shelfLife = changes.shelfLife
    return list;
}

export default Kind;
