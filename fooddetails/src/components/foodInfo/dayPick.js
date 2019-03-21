import React from 'react';
import { PickerView, WhiteSpace } from 'antd-mobile';
// import { deflate } from 'zlib';
const seasonValue = [];
for (var i = 1; i <= 31; i++) {
    seasonValue.push({
        label: i,
        value: i
    })
}
const seasons = [
    seasonValue
    ,
    [
        {
            label: '年',
            value: '年',
        },
        {
            label: '月',
            value: '月',
        },
        {
            label: '日',
            value: '日',
        }
    ],
];


class PickerViewExample extends React.Component {
    state = {
        value: [this.props.defaultDay,'日'],
    };
    onChange = (value) => {//滚动停留执行一次
        // console.log(value);
        this.setState({
            value,
        });
        if(value[1]==='月'){
            this.props.subLife(value[0]*30)
        }else if(value[1]==='年'){
            this.props.subLife(value[0]*365)
        }else{
            this.props.subLife(value[0])
        }
    }
    onScrollChange = (value) => {//滚一次执行一次
        // console.log('onScrollChange',value);
    }
    render() {
        return (
            <div className={this.props.className}>
                <PickerView
                    onChange={this.onChange}
                    onScrollChange={this.onScrollChange}
                    value={this.state.value}
                    data={seasons}
                    cascade={false}
                />
                <WhiteSpace /><WhiteSpace />

                <WhiteSpace /><WhiteSpace />

            </div>
        );
    }
}

export default PickerViewExample;