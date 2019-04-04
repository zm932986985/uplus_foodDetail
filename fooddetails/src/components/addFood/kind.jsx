//添加食材展示列表
import React from 'react';
import { Tabs, message, Icon } from 'antd';//UI插件库
import http from '../../server';//接口服务
import Draw from './Draw.jsx';//待选列表
import SerchFood from './serchFood.jsx';//搜索框
import JustGo from '../common/back.jsx';//返回按钮
import Food from '../common/FoodItem.jsx';//食材卡片
import { delArr, updateFood } from '../common/commonFn.js';//公用方法

const TabPane = Tabs.TabPane;

class Kind extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data_kind: [],
            pickList: [],
            isKindShow: true,
            activeKey: '0',
            isFakerShow: false,
            delOption:{}
        }
        this.pickFood = this.pickFood.bind(this);
        this.dropFood = this.dropFood.bind(this);
    }

    async getKind() {//获取所有食材的种类
        const res = await http.post(
            `${global.constants.apiName}/service/v1/food/getNewPublicFoodCatalogList?access_token=${this.props.token}`,
            { "updateDate": 1506787200000 }
        );
        (res.data.data).push({
            id: 99,
            name: "自定义"
        });
        this.setState({
            data_kind: res.data.data,
            activeKey: sessionStorage.getItem('cabins99') === '99' ? (res.data.data.length - 1).toString() : '0'
        }, () => {
            sessionStorage.removeItem('cabins99');//清楚从自定义食材界面的痕迹
            console.log('冰箱目前的种类列表：', this.state.data_kind);
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

    dropFood(id,attr) {//把选择的食物从待选列表中删除，动作由 Draw 触发传递到 Kind 父组件
        this.setState({
            pickList: delArr(this.state.pickList, id),
            delOption:attr
        });
    }

    toggleKind = (boolean) => {
        this.setState({
            isKindShow: boolean
        });
    }
    setActive = (i) => {
        this.setState({
            activeKey: i.toString()
        });
    }

    openFaker = () => {
        this.setState({
            isFakerShow: true
        });
    }
    closeFaker = () => {
        this.setState({
            isFakerShow: false
        });
        this.toggleKind(true)
    }
    componentDidMount() {
        this.getKind();
    }
    upLoadInfo = (foodAttrChange) => {
        //如果食材待选列表收到了食材更新信息就把食材列表对应的食材进行更新
        if (JSON.stringify(foodAttrChange) !== '{}') {
            this.setState({
                pickList: updateFood(this.state.pickList, foodAttrChange)
            }, () => {
                console.log('待选列表更新：', this.state.pickList);
                message.success('信息已修改');
            });
        }
    }

    render() {
        return (
            <>
                <div className='KindHeader'>
                    <div className={this.state.isFakerShow ? 'fakeHeader' : 'none'}>
                        <Icon type="left" onClick={this.closeFaker} />
                        <div>食材搜索</div>
                    </div>
                    <JustGo title="添加食材" route="/" className={this.state.isFakerShow ? 'none' : null} />
                    <SerchFood
                        isFakerShow={this.state.isFakerShow}
                        openFaker={this.openFaker}
                        closeFaker={this.closeFaker}
                        token={this.props.token}
                        pickList={this.state.pickList}
                        pickFood={this.pickFood}
                        dropFood={this.dropFood}
                        toggleKind={this.toggleKind} />
                </div>
                <div className={this.state.isKindShow ? 'Kind' : 'none'}>
                    <Draw
                        upLoadInfo={this.upLoadInfo}
                        pickList={this.state.pickList}
                        dropFood={this.dropFood}
                        token={this.props.token}
                    />
                    <Tabs
                        tabPosition={"left"}
                        type="card"
                        activeKey={this.state.activeKey}
                        onTabClick={i => this.setActive(i)}
                    >
                        {this.state.data_kind.map((todo, index) => {
                            return (
                                <TabPane
                                    tab={todo.name}
                                    key={index}
                                    style={{ position: "relative" }}
                                >
                                    <FoodKind
                                        delOption={this.state.delOption}
                                        token={this.props.token}
                                        kind={todo.id}
                                        pickFood={this.pickFood}
                                        pickList={this.state.pickList}
                                        dropFood={this.dropFood} />
                                </TabPane>
                            )
                        })}
                    </Tabs>

                </div>
            </>
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
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        //把需要查询的类别传入到组件接口中国单独根据类别调用食材接口
        if (this.props.kind === 99) {
            const url = `${global.constants.apiName}/service/app/v1/publicFood/getDeviceList?access_token=${this.props.token}`;

            const params = {
                "header": {
                    "deviceCode": "28ede01fdd56"
                },
                "data": {
                    "catalogId": 99
                }
            };
            const res = await http.post(url, params);
            const newList = res.data.data.map((food, index) => {
                return {
                    alias: "自定义",
                    id: food.deviceId + '_' + food.name,
                    name: food.name,
                    picUrl: food.imgUrl,
                    realCatalogName: food.name,
                    shelfLife: food.shelfLife,
                    storeArea: food.recomStoreArea,
                    storeAreaAdvise: food.recomStoreArea,
                    storeC: "-18"
                }
            });
            // 自定义食材需要在前面加上一个添加按钮
            const addIcon = {
                id: 'add',
                name: "添加",
                picUrl: require('../../assets/images/addPic.png'),
            };
            newList.reverse();
            newList.unshift(addIcon);
            this.setState({
                kindList: newList
            });
            console.log('自定义库的食材', this.state.kindList);
        } else {
            const url = `${global.constants.apiName}/service/v1/food/getNewPublicFoodSimpleList?access_token=${this.props.token}`;
            const params = { "classifyFaceId": this.props.kind };
            const res = await http.post(url, params);
            this.setState({
                kindList: res.data.data
            });
            // console.log('所有种类的食材：', res);
        }

    }

    pickSelf(foodAttr) {//食物--->待选列表（传给父组件Kind）
        var waitList = this.props.pickList.find(item => item.id === foodAttr.id);
        // console.log('waitList',waitList,foodAttr.id);
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
            <div className="FoodKind" style={{ padding: '.2rem 0 .7rem 0', overflowY: 'hidden' }}>
                <Food
                    delOption={this.props.delOption}
                    token={this.props.token}
                    foodList={this.state.kindList}
                    foodStyle={foodStyle}
                    pickSelf={this.pickSelf}
                    pickList={this.props.pickList}
                    father={'kind'}
                    isBarShow={true}
                />
            </div>
        )
    }
}




const foodStyle = {
    picStyle: {
        margin: '0 auto',
        marginTop: '0.1rem',
        width: '0.47rem',
        height: '0.47rem',
        borderRadius: '1rem',
    },
    Style: {
        width: '.6rem',
        margin: '0.1rem',
        height: '.9rem',
        border: 0
    },
    fontStyle: {
        // width: '.4rem',
        // margin: '0 auto',
        margin:'0 .05rem',
        fontFamily: 'PingFangSC-Light',
        fontSize: '.12rem',
        color: '#666666',
        letterSpacing: '0',
        textAlign: 'center',
        lineHeight: '0.36rem',
        // overflow: 'hidden',
        // textOverflow: 'ellipsis'
    },
    fontStyle2: {
        // width: '.4rem',
        // margin: '0 auto',
        margin:'0 .05rem',
        fontFamily: 'PingFangSC-Light',
        fontSize: '.12rem',
        color: '#E92325',
        letterSpacing: '0',
        textAlign: 'center',
        lineHeight: '0.36rem',
        // overflow: 'hidden',
        // textOverflow: 'ellipsis'
    }
}


export default Kind;