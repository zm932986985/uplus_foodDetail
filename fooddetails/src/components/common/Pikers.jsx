import React from 'react';
import { DatePicker, List, Picker } from 'antd-mobile';
import { message } from 'antd';

class Pickers extends React.Component {
  state = {
    date: new Date(),
    shelfLife: ['1', '天']
  }
  subValue = (value, type) => {
    this.props.subPickers(value, type)
  }
  render() {
    return (
      <div className="Pickers">
        {this.props.type === 'date' ? <DateSon title={this.props.title} subValue={this.subValue} value={this.props.value} /> : null}
        {this.props.type === 'shelfLife' ? <ShelfLifeSon Parent={this.props.Parent} title={this.props.title} subValue={this.subValue} value={this.props.value} /> : null}
      </div>
    )
  }
}
const DateSon=(props)=>{
  return (
    <List className="date-picker-list" style={{ backgroundColor: 'white' }}>
      <DatePicker
        maxDate={new Date()}
        mode="date"
        title=""
        extra="Optional"
        value={props.value}
        onChange={date => props.subValue(date, 'date')}
      >
        <List.Item arrow="horizontal"><span>{props.title}</span></List.Item>
      </DatePicker>
    </List>
  )
}

const number = [];
for (var i = 1; i < 366 * 2; i++) {
  number.push({
    label: i.toString(),
    value: i.toString(),
  })
}
const seasons = [
  number,
  [
    {
      label: '天',
      value: '天',
    },
    {
      label: '月',
      value: '月',
    },
    {
      label: '年',
      value: '年',
    }
  ],
];
class ShelfLifeSon extends React.PureComponent {
  constructor() {
    super()
    this.state = {
      isGray: true
    }
  }

  subValue = (shelfLife, type) => {
    this.setState({
      isGray: false
    });
    console.log('就是我', shelfLife)
    if (parseInt(shelfLife[0]) > 12 && shelfLife[1] === '月') {
      message.warning('月份不能大于12月');
    } else if (parseInt(shelfLife[0]) > 1 && shelfLife[1] === '年') {
      message.warning('月份不能大于1年');
    } else {
      this.props.subValue(shelfLife, type)
    }
  }
  render() {
    return (
      <Picker
        data={seasons}
        title=""
        cascade={false}
        extra={this.props.Parent === 'Info' ?this.props.value:' '}
        onOk={shelfLife => this.subValue(shelfLife, 'shelfLife')}
      >
        {this.props.Parent === 'Info' ?
          <List.Item arrow="horizontal">
            <span>{this.props.title}</span>
          </List.Item>
          :
          <List.Item arrow="horizontal">
            <div className="DeatailItem tit">保质期</div>
            <div className={this.state.isGray ? 'DeatailItem content_null' : 'DeatailItem content'}>
              {this.state.isGray ? '单位为天' : this.props.value[0]}
            </div>
          </List.Item>}
      </Picker>
    )
  }
}
export default Pickers;