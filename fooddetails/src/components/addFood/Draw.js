//添加食材-待选列表 added by zhangming at 20190318
import React from 'react';
import { Button,message } from 'antd'; 
import { Redirect } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';//渐渐消失的动画效果
import http from '../../server'
import Food from '../common/FoodItem';
const ButtonGroup = Button.Group;
const foodStyle = {
    picStyle: {
        width: '0.4rem',
        height: '0.4rem',
        borderRadius: ' 0.7rem',
        border: '.01rem solid gray'
    },
    Style: {
        width: '.6rem',
        float: 'left',
        margin: '.1rem',
        backgroundColor: 'white',
        padding: '.1rem',
        position: 'relative',
        /* display: inline-block; */
        border: '.01rem solid gray',
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
            redirect1: false
        }
        this.dropSelf = this.dropSelf.bind(this);
        this.addToCabin = this.addToCabin.bind(this);
        this.skipAdd = this.skipAdd.bind(this);
    }
    dropSelf(id) {
        this.props.dropFood(id)
    }
    pickSelf = (attr) => {
        typeof this.props.openInfo !== 'undefined'?this.props.openInfo(attr):console.log('未定义openInfo')
    }
    skipAdd() {
        this.setState({ redirect: true });
    }
    skipAdd1() {
        this.setState({ redirect1: true });
    }
    async addToCabin(pickList, location) {
        const deviceId = '28ede01fdd56';//某台611设备Id
        console.log('你的列表',pickList)
        var uploadList = pickList.map((food, index) => {
            return {
                dateOfProduct: food.dateOfProduct,
                createTime:(new Date().getTime()) + index,
                deviceId: deviceId,
                location: location,
                id: food.id,
                name: food.name,
                deviceid: deviceId,
                imgUrl: food.picUrl,
                shelfLife: food.shelfLife
            }
        });
        var params = {
            deviceId: deviceId,
            addFridgeFoods: uploadList
        };
        console.log('params', JSON.stringify(params));
        const url = `/unilife/service/v1/food/batchFridgeFoods?access_token=${this.props.token}`;
        const res = await http.post(url, params);
        if(res.data.errormsg==='success'){
            message.success('添加食材成功！');
           this.skipAdd1()
            console.log('route',this.history)
           
        }
        console.log('添加食材结果', res)
    }
    render() {
        if (this.state.redirect) {
            return <Redirect push to={`/Add/${this.props.token}`} />; //or <Redirect push to="/sample?a=xxx&b=yyy" /> 传递更多参数
        }
        if (this.state.redirect1) {
            return <Redirect push to="/"/>; //or <Redirect push to="/sample?a=xxx&b=yyy" /> 传递更多参数
        }
        const isShow = this.props.type === 'main'||this.props.pickList.length !== 0;
        return (
            <ReactCSSTransitionGroup
                component="div"
                transitionName="fade"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
                {
                    isShow &&
                    <>
                        <div className={this.props.type === 'main' ? 'none' : 'foodLi'}>
                            <div className="imgGroup">
                                <Food 
                                foodList={this.props.pickList} 
                                foodStyle={foodStyle} 
                                isIconShow={true} 
                                dropSelf={this.dropSelf} 
                                father={'Draw'} 
                                pickSelf={this.pickSelf}
                             />
                            </div>
                            <div>点击图片可编辑食材状况</div>
                        </div>
                        <ButtonGroup className={this.props.type !== 'main' ? 'none' : 'DealFool'} size="large">
                            <Button type={this.props.isDelete ? 'primary' : null} onClick={this.props.dropFood}>删除食材</Button>
                            <Button onClick={this.skipAdd}>添加食材</Button>
                        </ButtonGroup>
                            <ButtonGroup className={this.props.type === 'main' ? 'none' : 'DealFool1'} size="large">
                            <Button onClick={this.addToCabin.bind(this, this.props.pickList, 1)}>添加至冷藏室</Button>
                            <Button onClick={this.addToCabin.bind(this, this.props.pickList, 12)}>添加至冷冻室</Button>
                            <Button onClick={this.addToCabin.bind(this, this.props.pickList, 4)}>添加至变温室</Button>
                        </ButtonGroup>
                    </>
                }
            </ReactCSSTransitionGroup>
        );
    }
}

export default Draw;