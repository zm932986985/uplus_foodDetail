//查询食材 added by zhangming at 20190319
import { Input } from 'antd';
import React from 'react';
import http from '../../server'
import Food from '../common/FoodItem'
const Search = Input.Search;

export class SerchFood extends React.PureComponent {
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
                `/test/service/v1/food/searchByName?access_token=${window.localStorage.token}`,
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
    }
    componentDidMount(){
        this.onSearch()
    }
    // pickSelf=(foodAttr)=> {//食物--->待选列表（传给父组件Kind）
    //     var waitList = this.props.pickList.find(item => item.id === foodAttr.id);
    //     if (typeof (waitList) === 'undefined') {//如果是未选食材
    //         this.props.pickFood(foodAttr)//添加到待选列表
    //     }else{
    //         this.props.dropFood(foodAttr.id)//从待选列表中删除
    //     }
    // }
    dropSelf=(attr)=>{
        console.log(attr)
        this.props.dropFood(attr.id)
    }
    change=(a)=>{
        var that =this;
        var value = a.target.value;
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
            <div>
                <Search
                    placeholder="查找你想添加的食材"
                    onSearch={value => this.onSearch(value)}
                    onChange={this.change}
                    style={{ width: '3.55rem', margin: 'auto .1rem' }}
                />
                <div className={this.state.foodList.length === 0 ? 'none' : 'serchBlock'}>
                    <Food foodList={this.state.foodList} pickSelf={this.pickSelf} dropSelf={this.dropSelf} father={'serch'}/>
                </div>
            </div>
        )
    }
}