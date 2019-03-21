import React from 'react';
// import { Empty } from 'antd';
//默认图片组件，需要的是src（图片路径）、name（图片名称）以及 picStyle（图片样式）
const picStyle = {
    width: '.4rem',
    height: '.4rem',
    borderRadius: '.7rem',
    border: '.01rem solid lightgray'
}
class Img extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            picUrl: props.src
        };
        this.handleImageErrored = this.handleImageErrored.bind(this);
        this.handleImageLoaded = this.handleImageLoaded.bind(this);
    }
   componentWillReceiveProps(nextProps) {//进行比较，如果图片路径改变了一定要更新！！！！
        this.setState({picUrl: nextProps.src});
      }
    handleImageErrored() {
        this.setState({
            picUrl: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1649340373,2014401835&fm=26&gp=0.jpg'
        });
    }
    handleImageLoaded() {
        // console.log(1111)
    }
    render() {
        return (
            <img
                src={this.state.picUrl}
                alt={this.props.name}
                style={typeof (this.props.picStyle) === 'undefined' ? picStyle : this.props.picStyle}
                onLoad={this.handleImageLoaded}
                onError={this.handleImageErrored}
            />
        )
    }
}
export default Img;