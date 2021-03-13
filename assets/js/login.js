// 写个入口函数保险,不能一直确保引入的jq,js文件在结构最下面
$(function () {
    // 需求1:点击a链接,显示隐藏盒子
    $('#link_reg').on('click', function () {
        // 点击去注册,显示注册模块,隐藏登录模块
        $('.reg-box').show();
        $('.login-box').hide();
    });
    // 点击去登录,显示登录模块,隐藏注册模块
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });
    // 需求2:自定义校验规则
    let form = layui.form;
    form.verify({
        // 属性是校验规则名称,值是函数或数组
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 再次输入密码校验规则
        repwd: function (value, item) {
            console.log(value);
            // console.log($('.reg-box input[name=password]')); 准确找到注册页面的密码输入框
            let pwd = $('.reg-box input[name=password]').val();
            console.log(pwd);
            if (value !== pwd) {
                return "两次输入密码不一致"
            }
        }
    });
    // 需求3:注册用户
    let layer = layui.layer;
    // 给form表单绑定submit事件,点击button按钮就会触发submit事件 等价于给button绑定点击事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/reguser',
            type: 'POST',
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val(),
            },
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    // return alert(res.message); //o=成功;1=失败
                    return layer.msg(res.message, { icon: 5 })
                }
                // 提示成功
                // alert(res.message)
                layer.msg(res.message, { icon: 6 })
                // 切换登录模块
                $('#link_login').click();
                // 表单清空
                $('#form_reg')[0].reset();
            }
        });
    });

    // 需求4:用户登录
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                };
                // 提示信息保存token,
                layer.msg('登录成功');
                // 保存token,后面要用
                localStorage.setItem('token', res.token);
                // 跳转
                location.href = "/index.html"

            }
        });
    })
})