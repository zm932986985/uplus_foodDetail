import UplusApi from '@uplus/uplus-api'; //引入UplusApi库
export function nameToLocation(name) {
    var location = -1;
    switch (name) {
      case '冷藏室':
        location = 1;
        break;
      case '冷冻室1':
        location = 2;
        break;
      case '冷冻室2':
        location = 3;
        break;
      case '变温室':
        location = 4;
        break;
      case '左变温室':
        location = 5;
        break;
      case '右变温室':
        location = 6;
        break;
      case '上变温室':
        location = 7;
        break;
      case '下变温室':
        location = 8;
        break;
      case '007多功能变温室':
        location = 9;
        break;
      case '小变温室':
        location = 10;
        break;
      case '大变温室':
        location = 11;
        break;
      case '冷冻室':
        location = 12;
        break;
      case '上冷冻室':
        location = 13;
        break;
      case '下冷冻室':
        location = 14;
        break;
      case '左冷冻室':
        location = 15;
        break;
      case '右冷冻室':
        location = 16;
        break;
      case '保湿室':
        location = 17;
        break;
      case '冷冻变温室':
        location = 18;
        break;
      case '冷藏变温室':
        location = 19;
        break;
      case '保湿':
        location = 20;
        break;
  
      default:
        location = -1;
    }
    return location;
  }
  // const cabins = [{name:'冷藏室',location: 1}];
  export function locationToName(location) {
    var name = '未定义的舱室';
    switch (location) {
      case 1:
      name = '冷藏室';
        break;
      case 2:
      name = '冷冻室1';
        break;
      case 3:
      name = '冷冻室2';
        break;
      case 4:
      name = '变温室';
        break;
      case 5:
      name = '左变温室';
        break;
      case 6:
        name = '右变温室';
        break;
      case 7:
        name = '上变温室';
        break;
      case 8:
        name = '下变温室';
        break;
      case 9:
        name = '007多功能变温室';
        break;
      case 10:
        name = '小变温室';
        break;
      case 11:
        name = '大变温室';
        break;
      case 12:
        name = '冷冻室';
        break;
      case 13:
        name = '上冷冻室';
        break;
      case 14:
        name = '下冷冻室';
        break;
      case 15:
        name = '左冷冻室';
        break;
      case 16:
        name = '右冷冻室';
        break;
      case 17:
        name = '保湿室';
        break;
      case 18:
        name = '冷冻变温室';
        break;
      case 19:
        name = '冷藏变温室';
        break;
      case 20:
        name = '保湿';
        break;
  
      default:
        name = '未定义的舱室';
    }
    return name;
  }

  //计算保质期剩余方法
export function figTime(shelfLife, dateOfProduct) {
  // 接口返回：
  // dateOfProduct（时间戳）
  // shelfLife（保质期：天）

  // 计算保质期时间戳：shelfLifeTime（保质期对应的时间戳） = shelfLife*24*60*60*1000

  // 计算过期时间：overDueTime（过期时间戳）=dateOfProduct+shelfLifeTime

  // 获取当前时间戳：currentTime（当前时间戳） = new Date().getTime();

  // 计算百分比：(|currentTime-overDueTime|)/shelfLifeTime

  // 排序：overDueTime越小在越前面
  const shelfLifeTime = shelfLife * 24 * 60 * 60 * 1000;//保质期对应的时间戳
  const overDueTime = dateOfProduct + shelfLifeTime;//过期时间戳
  const currentTime = new Date().getTime();//当前时间戳
  const percent = (overDueTime - currentTime < 0 ? 0 : overDueTime - currentTime) / shelfLifeTime * 100;
  return { percent: percent, overDueTime: overDueTime };
}

export function figInfo(name, picUrl, location, dateOfProduct, shelfLife) {//时间戳日期转换方法
  var query = {
      pathname: '/Detail',
      query: {
          father: 'Draw',
          name: name,
          picUrl: picUrl,
          data: [
              {
                  name: '所在温区',
                  content: location
              },
              {
                  name: '生产日期',
                  content: fomatDate(new Date(dateOfProduct))//2019/4/1
              },
              {
                  name: '过期日期',
                  // content: this.props.todo.dateOfProduct + this.props.todo.shelfLife*3600*24*1000
                  content: fomatDate(new Date(dateOfProduct + shelfLife * 3600 * 24 * 1000))
              }
          ]
      }

  }

  // function fomatDate(date){
  //   console.log('daaaaaaa_before',date)
  //   var arr =date.split('/');
  //   return arr[0]+'年'+arr[1]+'月'+arr[2]+'日'
  // }
  

  function fomatDate(now) { 
    var year=now.getFullYear(); 
    var month=now.getMonth()+1; 
    var date=now.getDate(); 
    // var hour=now.getHours(); 
    // var minute=now.getMinutes(); 
    // var second=now.getSeconds(); 
    return year+"年"+month+"月"+date+"日"; 
    } 

    return query;
}



//根据指定的字段删除数组对象的对应对象
export function delArr(arr, iden) {
  var id = iden;//要删除的id
  var array = arr;
  var newArr = array.filter(function (obj) {
    return id !== obj.id;
  });
  return newArr;
}

export function findArr(arr, cabinID) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].location === cabinID) {
      newArr.push(arr[i])
    }
  }
  return newArr;
}

export function setProps(props,routeName){
  const { location } = props;
  let location_query;
  if (location&&location.query) {//当state有参数时，取参数并存到sessionStorage中
    location_query = location.query;
    sessionStorage.setItem(routeName+'location_query', JSON.stringify(location_query));// 存入到sessionStorage中
  } else {
    location_query = JSON.parse(sessionStorage.getItem(routeName+'location_query'));// 当state没有参数时，取sessionStorage中的参数
  }
  return location_query
}


//修改对象数组某个对象的属性
export function updateFood(list1, changes) {
  //寻找处于数组的下标位置并修改属性
  var list = list1;
  var index = list.findIndex(function (data) {
      return data.id === changes.id;
  });
  list[index].dateOfProduct = changes.dateOfProduct//保质期作为创造时间
  list[index].shelfLife = changes.shelfLife
  return list;
}
const instance = new UplusApi();
export function backPage() {
  instance.initDeviceReady().then(function() {
    console.log(instance.deviceReady);
  });
}


export function strlen(str){//判断字符串长度
  var len = 0;
  for (var i=0; i<str.length; i++) { 
   var c = str.charCodeAt(i); 
  //单字节加1
   if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
     len++; 
   } 
   else { 
    len+=2; 
   } 
  } 
  return len;
}