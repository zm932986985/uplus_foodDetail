import {getUrlParams} from './components/common/getUrlParams';


//获取地址栏参数的公用处理
const urlParamsObj = getUrlParams();

global.constants = {
    mac:urlParamsObj.mac?urlParamsObj.mac.toLowerCase():null,
    typeId: urlParamsObj.typeId.replace(/\//g,''),
    apiName:'http://mobile.unilifemedia.com',//优悦线上接口
    // apiName:'/mobile',//优悦线上接口
    line_xcook:'http://line.xcook.cn:8080',//优悦线上接口，获取舱室
    // line_xcook:'line1',//优悦线上接口，获取舱室
    enxcook: 'http://line.xcook.cn:7070'//优悦线上接口,图片base64转换
    // enxcook: 'line'//优悦线上接口,图片base64转换
};