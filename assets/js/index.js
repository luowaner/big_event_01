// 入口函数,写了比较安全
$(function () {
    // 需求1:ajax获取用户信息,渲染到页面
    getUserInfo();

    // 退出功能(写在入口函数里)
    $('#btnLogout').on('click', function () {
        layer.confirm('是否退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清空本地token
            localStorage.removeItem('token');
            // 2.页面跳转
            location.href = '/login.html';
            // 3.关闭询问框
            layer.close(index);
        });

    })

});


// ajax获取用户信息 封装函数:其他页面也要调用
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        // // 设置一个属性,配置头信息,设置token,身份识别认证
        // headers: {
        //     // 在登录跳转时保存了token
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: (res) => {
            // console.log(res);
            // 0 = 成功
            if (res.status != 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功,调用函数,渲染头像
            renderAvatar(res.data)
        },
        //登陆拦截: 判断身份认证信息
        // complete: function (res) {
        //     console.log(res);
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
        //         // 销毁token
        //         localStorage.removeItem('token');
        //         // 页面跳转
        //         location.href = '/login.html'
        //     }
        // }

    });
};

// 封装函数:渲染用户头像包含字母头像或用户自己上传的头像
function renderAvatar(user) {
    // console.log(user);
    // 渲染名称,如果没有就用username
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        let text = name[0] + toUpperCase();
        $('.text-avatar').show().html(text)
    }
}