
const files = require.context('../views/', true, /\_lang_zh.js$/)//获取所有语言文件
const modules = {}
files.keys().forEach(key => {//遍历语言文件
  modules.zh = files(key);
})
console.log(modules);
export default modules.zh