import React from 'react';
import { Button } from 'antd';
import Food from '../common/FoodItem'
import DatePick from './datePick';
import DayPick from './dayPick'
// const foodList = [{
//     picUrl: 'https://paimgcdn.baidu.com/558A1BFC3575F353?src=http%3A%2F%2Fms.bdimg.com%2Fdsp-image%2F1374755215.jpg&rz=urar_2_968_600&v=0',
//     name: '车厘子',
//     id: '123'
// }];
const foodStyle = {
    picStyle: {
        width: '1.2rem',
        height: '1.2rem',
        borderRadius: '1rem'
    },
    Style: {
        border: 0
    },
    fontStyle: {
        width: '1.2rem',
        marginLeft: '-.09rem',
        marginTop: '.2rem'
    }
}
class Info extends React.Component {//待选列表点击展开的食材信息，可修改生产日期和保质期（2者默认值均为传递值）,
    constructor(props) {
        super(props);
        console.log('食材信息组件获取到的食材信息：', props)
        this.state = {
            dateOfProduct: this.props.default.createTime,//生产日期
            shelfLife: this.props.default.shelfLife//保质期
        }
        this.changeDateOfProduct = this.changeDateOfProduct.bind(this);
        this.changeShelfLife = this.changeShelfLife.bind(this);
        this.upLoadInfo = this.upLoadInfo.bind(this);//修改信息上传方法
    }
    //改变生产日期，类型：int 时间戳
    changeDateOfProduct(date) {
        this.setState({
            dateOfProduct: date
        });
        console.log('生产日期', this.state.dateOfProduct,'（时间戳）');
    }
    //改变保质期，类型 int 整数，单位是天
    changeShelfLife(Life) {
        this.setState({
            shelfLife: Life
        });
        console.log('保质期', this.state.shelfLife, '天');
    }
    //食材信息上传
    upLoadInfo() {
        // console.log('这是你修改的信息：', this.state);
        const change={
            dateOfProduct:this.state.dateOfProduct,
            shelfLife:this.state.shelfLife,
            id:this.props.default.id

        }
        this.props.upLoadInfo(change);
    }
    render() {
        return (
            <>
                <div className="Info">
                    <div>
                        <div className="info_pic">
                            <Food foodList={[this.props.default]} foodStyle={foodStyle} />
                        </div>
                        <span style={{ float: 'left' }}>生产日期</span>
                        <span style={{ marginTop: '1rem', float: 'left', display: 'inline', marginLeft: '-.5rem' }}>保质期</span>
                        <div className="btnGroup">
                            <Button type={'dashed'} onClick={this.props.closeInfo}>取消</Button>
                            <Button type={'primary'} onClick={this.upLoadInfo}>确认</Button>
                        </div>
                    </div>

                </div>
                <DatePick
                    className={'DatePick'}
                    mode={'date'}
                    subDate={this.changeDateOfProduct}
                    subLife={this.changeShelfLife}
                    defaultDate={this.state.dateOfProduct}
                />
                <DayPick
                    className={'DayPick'}
                    subDate={this.changeDateOfProduct}
                    subLife={this.changeShelfLife}
                    defaultDay={this.state.shelfLife}
                />

            </>
        )
    }
}

export default Info;