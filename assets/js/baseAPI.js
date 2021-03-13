// 开发环境服务器路径地址
let baseURL = 'http://api-breakingnews-web.itheima.net'
// // 测试环境服务器路径地址
// let baseURL = ''
// // 生产环境服务器路径地址
// let baseURL = ''



// $.ajaxPrefilter 可以在调用$.ajax方法之后会立刻触发此方法,接收到ajax响应以后,还会触发此方法
$.ajaxPrefilter(function (options) {
    console.log(options);
    // 手动为url添加前缀 
    options.url = baseURL + options.url;
})