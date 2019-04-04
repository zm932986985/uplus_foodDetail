import React from 'react';
import { Redirect } from 'react-router-dom';
import { Card, Icon } from 'antd';
import { figInfo,strlen } from './commonFn';
import Img from './img.jsx';
import MyProgress from './prograssBar.jsx'
import { NoticeBar } from 'antd-mobile';
const Food = (props) => {
    return (
        <div className="foodGroup" style={(props.foodStyle || {}).waitStyle}>
            {props.foodList.map(function (todo, index) {
                return (
                    <div className="FoodItem" style={{ 'display': 'inline-block', 'float': 'left' }} key={index} >
                        <FoodItem
                            delOption={props.delOption}
                            cabinList={props.cabinList}
                            token={props.token}
                            todo={todo}
                            foodStyle={props.foodStyle}
                            isBarShow={props.isBarShow}
                            pickSelf={props.pickSelf}
                            dropSelf={props.dropSelf}
                            isIconShow={props.isIconShow}
                            father={props.father}
                            list={props.foodList}
                            isDelete={props.isDelete}
                        />
                    </div>
                )
            })}
        </div>
    )
}

class FoodItem extends React.Component {//单个食材
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            foodStyle: props.foodStyle || {},
            isGo: false
        };
    }
    checkFood = (foodAttr) => {
        if (foodAttr.id === 'add') {
            this.setState({ isGo: true }, () => { console.log('isGo', this.state.isGo) });
        } else {
            if (this.props.isDelete || this.props.father !== 'cabin') {

                this.props.father !== 'Draw' ? this.setState({ isChecked: !this.state.isChecked }) : console.log('是Draw');
                typeof this.props.pickSelf !== 'undefined' ? this.props.pickSelf(foodAttr) : console.log('引用组件未定义食材点击方法')//触发父页面的方法

            } else {
                this.setState({
                    isGo: true
                });
            }
        }
    }

    dropFood(foodAttr) {
        typeof this.props.dropSelf !== 'undefined' ? this.props.dropSelf(foodAttr, { id: foodAttr, isChecked: this.state.isChecked }) : console.log('引用组件未定义食材点击方法')//触发父页面的方法
    }

    componentWillReceiveProps(nextProps) {
        //如果食材待选列表收到了食材更新信息就把食材列表对应的食材进行更新
        if (nextProps.list !== this.props.list || nextProps.isDelete !== this.props.isDelete) {
            this.setState({
                isChecked: false
            });
        }
        if (nextProps.delOption ? nextProps.delOption.id === nextProps.todo.id : false) {
            this.setState({
                isChecked: nextProps.delOption.isChecked
            });
        }
    }
    render() {
        const { todo, cabinList, father, token, isIconShow, isBarShow } = this.props
        if (this.state.isGo && father === 'cabin') {//进入食材详情
            return (
                <Redirect push to={
                    figInfo(
                        todo.name,
                        todo.picUrl,
                        cabinList.find(i => parseInt(i.cabinID) === todo.location).name,
                        todo.dateOfProduct,
                        todo.shelfLife)
                } />
            )
        } else if (this.state.isGo && father === 'kind') {//进入自定义食材添加
            return (
                <Redirect push to={
                    {
                        pathname: '/Detail', query:
                        {
                            father: 'kind',
                            token: token
                        }
                    }
                } />
            )
        }

        if (typeof this.state.isChecked !== 'undefined') {
            return (
                <div style={{ position: 'relative' }}>
                    <Icon remarks="去除Icon" type="close-circle" theme="filled" onClick={() => this.dropFood(todo.id)} className={isIconShow ? 'IconOut' : 'none'} />
                    <Card
                        hoverable
                        style={this.state.foodStyle.Style || {}}
                        cover={<Img src={todo.picUrl} name={todo.name} picStyle={this.state.foodStyle.picStyle} />}
                        onClick={() => this.checkFood(todo)}
                    >
                        <Icon remarks="勾选Icon" type="check-circle" theme="filled" className={this.state.isChecked ? 'IconCheck' : 'none'} />
                        <div className={isBarShow ? 'FoodItemBar' : 'none'}>
                            <div style={this.state.foodStyle.fontStyle} className={todo.name === '添加' ? 'add_name' : null}>
                                {strlen(todo.name)<9?todo.name:
                                <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px',lineHeight:'.23rem' } }}  icon={false}>
                                {todo.name}
                                  </NoticeBar>}
                            </div>
                            {father === 'cabin' ?
                                <div className="Progress">
                                    <MyProgress
                                        percent={todo.percent !== 0 ? todo.percent : 100}
                                        color={todo.percent !== 0 ? '#44BE3C' : '#ED2856'}
                                    />
                                </div>
                                : null}
                        </div>
                        {father === 'Draw' ?
                            <div className="dateOfProduct" remarks="保质期天数提示">
                                <span>
                                    {todo.shelfLife}
                                    天
                                    </span>
                            </div>
                            : null}
                    </Card>
                </div>
            )
        }
        return (<div>空组件</div>)
    }
}

export default Food;