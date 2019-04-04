//添加食材-待选列表 added by zhangming at 20190318
import React from 'react';
import { message } from 'antd';
import { Button } from 'antd-mobile';
import { Redirect } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';//渐渐消失的动画效果
import http from '../../server'
import Food from '../common/FoodItem.jsx';
import Info from '../foodInfo/index.jsx'
const foodStyle = {
    picStyle: {
        width: '0.4rem',
        height: '0.4rem',
        borderRadius: ' 0.7rem'
    },
    Style: {
        width: '.6rem',
        float: 'left',
        margin: '.1rem',
        backgroundColor: 'white',
        padding: '.1rem',
        position: 'relative',
        // boxShadow: '0 .1rem .13rem -.12rem black'
    },
    fontStyle: {
        width: '.6rem',
        marginLeft: '-.2rem'
    },
    waitStyle: {
        /* overflow: hidden, */
        fontSize: '.1rem',
        display: '-webkit-flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        overflowY: 'hidden',
    },
    iconStyle: {
        color: 'gray',
        position: 'absolute',
        left: '.58rem',
        top: '.03rem',
        zIndex: '9',
        backgroundColor: 'white',
        borderRadius: '.1rem',
        fontSize: '.2rem'
    }
}
class Draw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            isInfoShow: false,
            foodAttr: {},
            foodAttrChange: {}
        }
        this.dropSelf = this.dropSelf.bind(this);
        this.addToCabin = this.addToCabin.bind(this);
        this.skipAdd = this.skipAdd.bind(this);
    }
    dropSelf(id,attr) {
        this.props.dropFood(id,attr)
    }
    pickSelf = (attr) => {
        this.setState({
            isInfoShow: true,
            foodAttr: attr
        });
    }

    closeInfo = () => {
        this.setState({
            isInfoShow: false
        });
    }

    upLoadInfo = (Change) => {
        this.setState({
            isInfoShow: false,
            foodAttrChange: Change
        });
        this.props.upLoadInfo(Change)
        console.log('下发给 Kind 组件的修改信息：', Change)
    }
    skipAdd() {
        this.setState({ redirect: true });
    }
    async addToCabin(pickList, cabinID) {
        var uploadList = pickList.map((food, index) => {
            return {
                dateOfProduct: food.dateOfProduct,
                createTime: (new Date().getTime()) + index,
                deviceId: global.constants.mac,
                location: cabinID,
                id: food.id,
                name: food.name,
                deviceid: global.constants.mac,
                imgUrl: food.picUrl,
                shelfLife: food.shelfLife
            }
        });
        var params = {
            deviceId: global.constants.mac,
            addFridgeFoods: uploadList
        };
        console.log('你的列表',uploadList)
        console.log('params', JSON.stringify(params));
        const url = `${global.constants.apiName}/service/v1/food/batchFridgeFoods?access_token=${this.props.token}`;
        const res = await http.post(url, params);
        if (res.data.errormsg === 'success') {
            message.success('添加食材成功！');
            // this.skipAdd1()
            window.history.back();
            console.log('route', this.history)

        }
        console.log('添加食材结果', res)
    }


    delFood = () => {
        this.props.dropFood()
    }

    calcelDel = () => {
        this.props.cancelDel()
    }
    render() {
        if (this.state.redirect) {
            const query = {
                pathname: '/Add',
                query: {
                    token: this.props.token
                }
            }
            return <Redirect push to={query} />; //or <Redirect push to="/sample?a=xxx&b=yyy" /> 传递更多参数
        }
        const isShow = this.props.type === 'main' || this.props.pickList.length !== 0;
        const cabinClass = window.localStorage.cabinList ? 'cabinBtn' + JSON.parse(window.localStorage.cabinList).cabinInfos.length : 'localerr';
        return (
            <ReactCSSTransitionGroup
                component="div"
                transitionName="fade"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
                {
                    isShow &&
                    <>
                        {this.state.isInfoShow ?
                            <Info
                                closeInfo={this.closeInfo}
                                default={this.state.foodAttr}
                                upLoadInfo={this.upLoadInfo}
                            /> : null}
                        <div className={this.props.type === 'main' ? 'none' : 'foodLi'}>
                            <div className="imgGroup">
                                <Food
                                    
                                    foodList={this.props.pickList}
                                    foodStyle={foodStyle}
                                    isIconShow={true}
                                    dropSelf={this.dropSelf}
                                    father={'Draw'}
                                    pickSelf={this.pickSelf}
                                    isBarShow={false}
                                />
                            </div>
                            <div className="DrawTips">点击图片可编辑食材状况</div>
                        </div>
                        {this.props.isDelShow ? <div className="lonlyBtn"><Button type="primary" onClick={this.skipAdd}>添加食材</Button></div> :
                            <div className={this.props.type !== 'main' ? 'none' : 'DealFool'} size="large">
                                {this.props.isDelete ?
                                    <>
                                        <div style={{display:'inline-flex'}}><Button inline onClick={this.calcelDel} activeStyle={false}>取消选择</Button>
                                        <Button inline type="warning" onClick={this.delFood} activeStyle={false}>删除食材</Button></div>
                                    </>
                                    :
                                    <><div style={{display:'inline-flex'}}>
                                        <Button inline onClick={this.delFood} activeStyle={false}>删除食材</Button>
                                        <Button inline type="primary" onClick={this.skipAdd} activeStyle={false}>添加食材</Button></div>
                                    </>
                                }
                            </div>}
                        <div className={this.props.type === 'main' ? 'none' : 'DealFool1'} size="large">
                            {window.localStorage.cabinList && JSON.parse(window.localStorage.cabinList).cabinInfos
                                ? JSON.parse(window.localStorage.cabinList).cabinInfos.map((todo, index) => {
                                    return (
                                        <div key={index} className={'cabinBtn ' + cabinClass}>
                                            <Button inline onClick={this.addToCabin.bind(this, this.props.pickList, todo.cabinID)}>添加到{todo.cabinName}</Button>
                                        </div>

                                    )
                                }) : null}
                        </div>
                    </>
                }
            </ReactCSSTransitionGroup>
        );
    }
}

export default Draw;