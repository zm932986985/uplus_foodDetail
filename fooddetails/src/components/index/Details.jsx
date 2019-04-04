//食材信息页面
import { List, message } from 'antd';//插件库
import { InputItem, ImagePicker, Button,Toast } from 'antd-mobile';
import React from 'react';
import Back from '../common/back.jsx';
import http from '../../server';
import { setProps } from '../common/commonFn';
import Pikers from '../common/Pikers.jsx';
function loadingToast() {
    Toast.loading('Loading...', 1, () => {
      console.log('Load complete !!!');
    });
  }
class Detail extends React.PureComponent {
    componentDidMount(){
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    render() {
        const location_query = setProps(this.props, 'Detail_');
        console.log(this.props.location.query)
        return (
            location_query.father === 'Draw' ?
                <FatherDraw
                    query={location_query}
                /> :
                <FatherKind
                    query={location_query}
                />
        )
    }
}
const FatherDraw = (props) => {
    console.log('daaaaaaaa',props.query.data);
    return (
        <div className="Detail">
            <Back route="/" title={props.query.name} />
            <div className="Detail_pic">
                <img
                    src={props.query.picUrl}
                    alt="暂无图片" />
            </div>
            <div>
                <List
                    bordered
                    dataSource={props.query.data}
                    renderItem={item => (
                        <div className="FatherDrawListItem">
                            <div>{item.name}</div>
                            <div>{item.content}</div>
                        </div>
                    )}
                />
            </div>
        </div>
    )
}

const ButtonStyle={
    height:'.44rem',
    lineHeight:'.44rem'
}
class FatherKind extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            files: [],
            isGo: false,
            name: '',
            shelfLife: 1
        }
        this.getPicUrl = this.getPicUrl.bind(this);//base64图片上传至服务器获取图片链接接口
        this.upLoadFood = this.upLoadFood.bind(this);//上传自定义食材接口
        this.handleChange = this.handleChange.bind(this);
        this.subPickers = this.subPickers.bind(this);
    }
    pickSelf(picUrl) {
        loadingToast();
        console.log('url', picUrl)
        //1、触发优家提供的接口把图片上传至服务器并获取图片链接
        const base64 = this.state.files[0].url.split(',')[1];
        const picname = new Date().getTime() + this.state.files[0].file.name;
        const name = this.state.name;
        const shelfLife = this.state.shelfLife;
        this.getPicUrl(global.constants.mac, base64, picname, name, shelfLife)
    }
    onChange = (files, type, index) => {
        console.log('图片信息', files);
        this.setState({
            files
        });
    }
    async getPicUrl(mac, base64, picname, name, shelfLife) {

        const url = `${global.constants.enxcook}/LinkCook//tft/push/base64`;
        const params = {
            base64: base64,
            fileName: picname
        };
        const res = await http.post(url, params);
        console.log('图片转译成功！', res)
        const picUrl = res.data.imgUrl;
        //2.接口调用成功后调用上传自定义食材接口
        this.upLoadFood(mac, name, picUrl, shelfLife)
    }

    async upLoadFood(mac, name, picUrl, shelfLife) {
        const url = `${global.constants.apiName}/service/v1/food/batchFridgeFoodsRepo?access_token=${this.props.query.token}`;
        var params = {
            deviceId: mac,
            addFridgeFoodsRepo: [{
                deviceId: mac,
                name: name,
                recomStoreArea: name.indexOf("肉") === -1 ? '冷藏室' : '冷冻室',
                imgUrl: picUrl,
                shelfLife: shelfLife,
                catalogId: 99,//自定义类别
                catalogName: '我的食材库',
            }]
        };
        console.log('上传字段', JSON.stringify(params));

        const res = await http.post(url, params);
        console.log('上传自定义食材成功！', res);
        if (res.data.errormsg === 'success') {
            // const location_query = setProps(this.props, 'Detail_');
            sessionStorage.setItem('cabins99','99');
            window.history.back();
            message.success('上传自定义食材成功！');
            console.log('上传自定义食材成功！', res);
        }
    }

    subDate = (v) => {
        if (v[1] === '天') {
            this.setState({ shelfLife: v[0] },()=>{
                console.log(v,this.state.shelfLife)
            })
        } else if (v[1] === '月') {
            this.setState({ shelfLife: v[0] * 30 })
        } else {
            this.setState({ shelfLife: v[0] * 360 })
        }

    }
    subPickers(value, type) {
        console.log(value, type);
            this.setState({
                shelfLife: value[0] * ((value[1] === '天' && 1) || (value[1] === '月' && 30) || (value[1] === '年' && 365))
            }, () => {
                console.log('shelfLife:', this.state.shelfLife)
            });
    }

    handleChange(event) {
        this.setState({ shelfLife: event });
    }

    render() {
        const { files } = this.state;
        return (
            <div className="Detail">
                <Back route="/Add" title="添加食材" token={this.props.query.token} />
                <div className="custom_pic" onClick={() => console.log(111111)}>
                    <div className="ImagePicker">
                        <ImagePicker
                            files={files}
                            onChange={this.onChange}
                            selectable={files.length < 1}
                            length={1}
                        />
                    </div>
                    {files.length === 0 ? <div><span>添加食材图片</span></div> : null}
                </div>
                <div className="custom_text">
                    <List>
                        <InputItem
                            clear
                            placeholder="填写食材名称"
                            ref={el => this.autoFocusInst = el}
                            onBlur={name => this.setState({ name })}
                        >
                         <div className="DeatailItem">食材名称</div>
                        </InputItem>
                        <Pikers 
                        subPickers={this.subPickers} 
                        title="保质期" 
                        Parent="Details" 
                        type="shelfLife" 
                        value={[this.state.shelfLife.toString(), '天']} 
                        />
                    </List>
                </div>
                <div className="custom_submit">
                    <Button
                        type="primary"
                        onClick={this.pickSelf.bind(this, this.state.files)}
                        disabled={this.state.name === '' || this.state.shelfLife === '' || files.length === 0}
                        style={ButtonStyle}
                    >添加到食材库</Button>
                </div>
            </div>
        )
    }
}
export default Detail;