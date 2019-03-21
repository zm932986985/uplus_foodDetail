const proxy = require('http-proxy-middleware');

module.exports = function(app) {
   const test1 = 'http://test.unilifemedia.com';
   // const real = 'http://fridge.unilifemedia.com:8100';
  app.use(proxy('/app', { 
       target: test1 ,
       secure: false,
       changeOrigin: true,
       pathRewrite: {
        "^/app": "/"
       }
       // cookieDomainRewrite: "http://localhost:3000"
    }));
    app.use(proxy('/test', { 
        target: 'http://test.unilifemedia.com/' ,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
         "^/test": "/"
        }
        // cookieDomainRewrite: "http://localhost:3000"
     }));
     app.use(proxy('/uplus', { //优家线上舱室接口
      target: 'http://line.xcook.cn:8080' ,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
       "^/uplus": "/"
      }
      // cookieDomainRewrite: "http://localhost:3000"
   }));
   app.use(proxy('/uplustest', { //优家线上舱室接口
      target: 'http://enxcook.xcook.cn:8081' ,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
       "^/uplustest": "/"
      }
      // cookieDomainRewrite: "http://localhost:3000"
   }));
   const test2 = 'http://test.unilifemedia.com';
   // const real = 'http://mobile.unilifemedia.com';
   app.use(proxy('/unilife', { //优家线上舱室接口
      target: test2 ,
      secure: false,
      changeOrigin: true,
      pathRewrite: {
       "^/unilife": "/"
      }
      // cookieDomainRewrite: "http://localhost:3000"
   }));
};