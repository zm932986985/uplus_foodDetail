//查询食材 added by zhangming at 20190319
import { Input } from 'antd';
import React from 'react';
import http from '../../server'
import Food from '../common/FoodItem.jsx';
const Search = Input.Search;
const foodStyle={
    Style:{
        width:'.78rem',
        height:'.9rem'
    },
    picStyle:{
        width:'.48rem',
        height:'auto'
    },
    fontStyle:{
        fontFamily: 'PingFangSC-Light, sans-serif',
        fontSize: '.12rem' ,
        color: '#333333' ,
        letterSpacing: '0',
        textAlign: 'center',
        lineHeight: '.2rem'
    }
}
class SerchFood extends React.PureComponent {
    state = {
        foodList: [],
        indicatorTime:0
    }
    async onSearch(value) {
        // PublicFoodInfoVo：
        // pageSize：查询条数 默认100，如指定小于1的数，则表示查询所有
        // offset：偏移量
        // name：食材关键字
        // matchMode：查詢匹配模式，0模糊匹配，1精准匹配
        if(value!==''){
            const res = await http.post(
                `${global.constants.apiName}/service/v1/food/searchByName?access_token=${this.props.token}`,
                {
                    "name": value,
                    "matchMode": 0
                }
            );
            if (res.data.errormsg === 'success') {
                console.log('搜索结果', res);
                this.setState({
                    foodList: res.data.data
                });
                    this.props.toggleKind(false);//关闭种类列表

            }
        }else{
            this.setState({
                foodList: []
            });
        }

    }
    pickSelf=(attr)=>{
        console.log(attr)
        this.props.pickFood(attr);
        this.setState({
            foodList: []
        });
        this.props.toggleKind(true)//打开种类列表
        this.props.closeFaker()
    }
    componentDidMount(){
        this.onSearch()
    }
    dropSelf=(attr)=>{
        console.log(attr)
        this.props.dropFood(attr.id)
    }
    change=(a)=>{
        var that =this;
        var value = a.target.value;
        if(value===''){
            this.props.toggleKind(true)//打开种类列表
        }
        if(this.state.indicatorTime!==0){
            window.clearTimeout(this.state.indicatorTime);
          }
          this.setState({
            indicatorTime: window.setTimeout(() => {
                console.log('yessssss',value)
                that.onSearch(value);
            }, 1000)
          });

    }
    render() {
        return (
            <div className="SerchFood">
                <Search
                    placeholder="搜索"
                    onSearch={value => this.onSearch(value)}
                    onChange={this.change}
                    onFocus={this.props.openFaker}
                />
                {/* {this.props.isFakerShow?<div className={this.state.foodList.length === 0 ? 'none' : 'serchBlock'}> */}
                {this.props.isFakerShow?<div className="serchBlock" > 
                    <Food isBarShow={true} foodList={this.state.foodList} pickSelf={this.pickSelf} dropSelf={this.dropSelf} father={'serch'} foodStyle={foodStyle}/>
                </div>:null}
            </div>
        )
    }
}

export default SerchFood;