import React from 'react';
import { Picker, List } from 'antd-mobile';

const seasonsItem = [];
for (var i = 1; i < 366; i++) {
  seasonsItem.push({
    label: i,
    value: i,
  });
}
const seasons = [
  seasonsItem,
  [
    {
      label: '日',
      value: '日',
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

const itemStyle = {
  fontFamily: 'PingFangSC-Light, sans-serif',
  fontSize: '.17rem',
  color: '#333333',
  textAlign: 'center',
  lineHeight: '.44rem',
  height:'.44rem'
}
class DatePick extends React.Component {
  render() {
    return (
      <div className="DatePickSeason">
        <Picker
          data={seasons}
          title=""
          cascade={false}
          extra=" "
          onOk={v => this.props.subDate(v)}
          itemStyle={itemStyle}
        >
          <List.Item arrow="horizontal">
            <div className="DeatailItem tit">保质期</div>
            <div className={this.props.shelfLife === '' ? 'DeatailItem content_null' : 'DeatailItem content'}>{this.props.shelfLife === '' ? '单位为天' : this.props.shelfLife}</div>
          </List.Item>

        </Picker>
      </div>
    );
  }
}

export default DatePick;