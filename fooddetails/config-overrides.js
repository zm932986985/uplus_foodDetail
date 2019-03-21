const {
  override,
  fixBabelImports,
  addLessLoader,
} = require("customize-cra");


module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd-mobile",//这里原来是antd，但是我用了mobild的就改成这个了
    libraryDirectory: "es",
    style: true // change importing css to less
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#1DA57A"
    }
  })
);

// const {
//   injectBabelPlugin
// } = require('react-app-rewired');
// module.exports = function override(config, env) {
//   config = injectBabelPlugin(['import', {
//     libraryName: 'antd-mobile',
//     style: 'css'
//   }], config);
//   return config;
// };