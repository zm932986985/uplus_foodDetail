import React from 'react';
import { DatePickerView } from 'antd-mobile';
// import enUs from 'antd-mobile/lib/date-picker-view/locale/en_US';

class DatePickerViewExample extends React.Component {
  state = {
    value: new Date(this.props.defaultDate),
  };
  onChange = (value) => {
    // console.log('onChange',value);
    this.setState({ value });
    this.props.subDate(value.getTime())
  };
  // onValueChange = (...args) => {
    // console.log('onValueChange',args);
  // };
  render() {
    return (<div className={this.props.className}>
      <DatePickerView
        value={this.state.value}
        onChange={this.onChange}
        // onValueChange={this.onValueChange}
        mode={this.props.mode}
      />
    </div>);
  }
}

export default DatePickerViewExample;