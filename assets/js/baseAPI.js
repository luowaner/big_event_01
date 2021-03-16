// 开发环境服务器路径地址
let baseURL = 'http://api-breakingnews-web.itheima.net'
// // 测试环境服务器路径地址
// let baseURL = ''
// // 生产环境服务器路径地址
// let baseURL = ''



// $.ajaxPrefilter 可以在调用$.ajax方法之后会立刻触发此方法,接收到ajax响应以后,还会触发此方法
$.ajaxPrefilter(function (options) {
    // console.log(options);
    // 手动为url添加前缀 
    options.url = baseURL + options.url;

    // 需求2:包含/my/的都手动添加头信息
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            // 在登录跳转时保存了token
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 登陆拦截
    options.complete = function (res) {

        // console.log(res);
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            // 销毁token
            localStorage.removeItem('token');
            // 页面跳转
            location.href = '/login.html'
        }
    }

})