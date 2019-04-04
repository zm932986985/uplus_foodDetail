import React from 'react';
import { Progress } from 'antd-mobile';

const style = {
  height: '.07rem'
}

const MyProgress = (props) => {
  const barStyle = {
    backgroundColor: props.color
  }
  return (
    <div className="MyProgress">
      <Progress barStyle={barStyle} style={style} percent={props.percent} position="normal" />

    </div>
  )
}


export default MyProgress;