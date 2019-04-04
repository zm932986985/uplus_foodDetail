import React from 'react';
import Pikers from '../common/Pikers.jsx'
import { figTime } from '../common/commonFn'
import { message } from 'antd';

class Info extends React.Component {//待选列表点击展开的食材信息，可修改生产日期和保质期（2者默认值均为传递值）,
    constructor(props) {
        super(props);
        this.state = {
            dateOfProduct: props.default.createTime,//生产日期
            shelfLife: props.default.shelfLife//保质期
        }
        this.changeDateOfProduct = this.changeDateOfProduct.bind(this);
        this.changeShelfLife = this.changeShelfLife.bind(this);
        this.upLoadInfo = this.upLoadInfo.bind(this);//修改信息上传方法
        this.subPickers = this.subPickers.bind(this);
    }
    //改变生产日期，类型：int 时间戳
    changeDateOfProduct(date) {
        this.setState({
            dateOfProduct: date
        });
        console.log('生产日期', this.state.dateOfProduct, '（时间戳）');
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
        const percent = figTime(this.state.shelfLife, this.state.dateOfProduct);
        console.log('percent', percent);
        if (percent.percent !== 0) {
            const change = {
                dateOfProduct: this.state.dateOfProduct,
                shelfLife: this.state.shelfLife,
                id: this.props.default.id
            }
            this.props.upLoadInfo(change);
        } else {
            message.warning('该食材已被定义为过期食材');
         }

    }

    subPickers(value, type) {
        if (type === 'shelfLife') {
            this.setState({
                shelfLife: parseInt(value[0]) * ((value[1] === '天' && 1) || (value[1] === '月' && 30) || (value[1] === '年' && 365))
            }, () => {
                console.log('shelfLife:', this.state.shelfLife)
            });
        } else {
            this.setState({
                dateOfProduct: value.getTime()
            }, () => {
                console.log('dateOfProduct:', this.state.dateOfProduct)
            })
        }
    }
    componentWillReceiveProps(){
        console.log('******************************************************')
    }
    render() {
        return (
            <>
                <div className="Info">
                    <div>
                        <div className="info_pic">
                            <img src={this.props.default.picUrl} alt="" />
                            <div className="foodname">{this.props.default.name}</div>
                        </div>
                        <div>
                            <div>
                                <Pikers subPickers={this.subPickers} title="生产日期" Parent="Info" type="date" value={new Date(this.state.dateOfProduct)} />
                                <Pikers subPickers={this.subPickers} title="保质期" Parent="Info" type="shelfLife" value={[this.state.shelfLife.toString(), '天']} />
                            </div>
                        </div>
                        <div className="spanGroup">
                            <div type={'dashed'} onClick={this.props.closeInfo}>取消</div>
                            <div type={'primary'} onClick={this.upLoadInfo}>确认</div>
                        </div>
                    </div>

                </div>
            </>
        )
    }
}

export default Info;