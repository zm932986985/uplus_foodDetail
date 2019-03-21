import React from 'react';
import { Redirect } from 'react-router-dom';
import { Card, Progress, Icon } from 'antd';
import Img from '../common/img'
const { Meta } = Card;//卡片
const foodCheck = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 98,
    lineHeight: '1.57rem',
    backgroundColor: 'rgba(0, 0, 0, .7)',
    color: 'white'
};
const foodCheck_Kind = {
    width: '95%',
    height: '95%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 98,
    lineHeight: '1rem',
    backgroundColor: 'rgba(0, 0, 0, .7)',
    color: 'white'
};

class Food extends React.Component {//食材群体
    render() {
        return (
            <div style={(this.props.foodStyle || {}).waitStyle}>
                {this.props.foodList.map(function (todo, index) {
                    return (
                        <div className="FoodItem" style={{ 'display': 'inline-block', 'float': 'left' }} key={index} >
                            <FoodItem
                                todo={todo}
                                foodStyle={this.props.foodStyle}
                                isBarShow={this.props.isBarShow}
                                pickSelf={this.props.pickSelf}
                                dropSelf={this.props.dropSelf}
                                isIconShow={this.props.isIconShow}
                                father={this.props.father}
                                list={this.props.foodList}
                                isDelete={this.props.isDelete}
                            />
                        </div>
                    )
                }.bind(this))}
            </div>
        )
    }
}

class FoodItem extends React.PureComponent {//单个食材
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            foodStyle: props.foodStyle || {},
            isGo: false
        };
    }

    checkFood = (foodAttr) => {
        if (this.props.isDelete||this.props.father !== 'cabin') {
            if (this.props.father === 'Draw') {

            } else {
                this.setState({
                    isChecked: !this.state.isChecked
                });
            }
            typeof this.props.pickSelf !== 'undefined' ? this.props.pickSelf(foodAttr) : console.log('引用组件未定义食材点击方法')//触发父页面的方法
        } else {
            console.log('跟我去路由吧');
            this.setState({
                isGo: true
            });
        }


    }
    dropFood(foodAttr) {
        typeof this.props.dropSelf !== 'undefined' ? this.props.dropSelf(foodAttr) : console.log('引用组件未定义食材点击方法')//触发父页面的方法
    }

    componentWillReceiveProps(nextProps) {
        //如果食材待选列表收到了食材更新信息就把食材列表对应的食材进行更新
        if (nextProps.list !== this.props.list) {
            this.setState({
                isChecked: false
            });
        }
    }
    render() {
        if (this.state.isGo&&this.props.father === 'cabin') {
            var query = {
                pathname: '/Detail',
                query: {
                    name: this.props.todo.name,
                    picUrl: this.props.todo.picUrl,
                    data: [
                        {
                            name: '所在温区',
                            content: '变温区'
                        },
                        {
                            name: '生产日期',
                            // content:this.props.todo.dateOfProduct
                            content: new Date(this.props.todo.dateOfProduct).toLocaleDateString()
                        },
                        {
                            name: '过期日期',
                            // content: this.props.todo.dateOfProduct + this.props.todo.shelfLife*3600*24*1000
                            content: new Date(this.props.todo.dateOfProduct + this.props.todo.shelfLife*3600*24*1000).toLocaleDateString()
                        }
                    ]
                }

            }
            return (
                <Redirect push to={query} />
            )
        }
        if (typeof this.state.isChecked !== 'undefined') {
            return (
                <div style={{ position: 'relative' }}>
                    <Icon type="close-circle"
                        style={this.state.foodStyle.iconStyle}
                        onClick={() => this.dropFood(this.props.todo.id)}
                        className={this.props.isIconShow ? null : 'none'} />
                    <Card
                        hoverable
                        style={this.state.foodStyle.Style || {}}
                        bodyStyle={{ 'width': '.9rem', 'padding': '0.1rem' }}
                        cover={<Img src={this.props.todo.picUrl} name={this.props.todo.name} picStyle={this.state.foodStyle.picStyle} />}
                        onClick={() => this.checkFood(this.props.todo)}
                    >
                        {/* 选中标识 */
                            this.props.father === 'kind' ?
                                <div style={this.state.isChecked ? foodCheck_Kind : { display: 'none' }} name={this.props.todo.name}><Icon type="check" style={{ fontSize: '.4rem' }} /></div> :
                                <div style={this.state.isChecked ? foodCheck : { display: 'none' }} name={this.props.todo.name}><Icon type="check" style={{ fontSize: '.4rem' }} /></div>
                        }


                        <Meta
                            title={this.props.todo.name} style={this.state.foodStyle.fontStyle}
                        />
                        <div style={{ 'width': '100%' }} className={this.props.isBarShow ? null : 'none'}>
                            {this.props.todo.percent !== 0 ?
                                <Progress percent={this.props.todo.percent} size="small" showInfo={false} />
                                : <Progress percent={100} size="small" showInfo={false} status={'exception'} />}
                        </div>
                    </Card>
                </div>
            )
        }
        return (<div>空组件</div>)
    }
}

function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}


export default Food;