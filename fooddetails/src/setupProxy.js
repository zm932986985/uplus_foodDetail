const proxy = require('http-proxy-middleware');

module.exports = function(app) {
   // const test1 = 'http://test.unilifemedia.com';
   // const real = 'http://mobile.unilifemedia.com:8100';
  app.use(proxy('/mobile', { //************************************需要修改*****************************
       target: 'http://mobile.unilifemedia.com' ,
       secure: false,
       changeOrigin: true,
       pathRewrite: {
        "^/mobile": "/"
       }
       // cookieDomainRewrite: "http://localhost:3000"
    }));
     app.use(proxy('/uplus', { 
      target: 'http://line.xcook.cn:8080' ,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
       "^/uplus": "/"
      }
      // cookieDomainRewrite: "http://localhost:3000"
   }));
   // app.use(proxy('/uplustest', { //优家测试接口
   //    target: 'http://enxcook.xcook.cn:8081' ,
   //    secure: false,
   //    changeOrigin: true,
   //    pathRewrite: {
   //     "^/uplustest": "/"
   //    }
   //    // cookieDomainRewrite: "http://localhost:3000"
   // }));

   // app.use(proxy('/enxcook', {//优家测试接口
   //    target: 'http://enxcook.xcook.cn:9090' ,
   //    secure: false,
   //    changeOrigin: true,
   //    pathRewrite: {
   //     "^/enxcook": "/"
   //    }
   //    // cookieDomainRewrite: "http://localhost:3000"
   // }));

   // app.use(proxy('/line1', {//优家线上接口,获取舱室
   //    target: 'http://line.xcook.cn:8080' ,
   //    secure: false,
   //    changeOrigin: true,
   //    pathRewrite: {
   //     "^/line1": "/"
   //    }
   //    // cookieDomainRewrite: "http://localhost:3000"
   // }));

   // app.use(proxy('/line', {//优家线上接口,base64转换图片
   //    target: 'http://line.xcook.cn:7070' ,
   //    secure: false,
   //    changeOrigin: true,
   //    pathRewrite: {
   //     "^/line": "/"
   //    }
   //    // cookieDomainRewrite: "http://localhost:3000"
   // }));
};