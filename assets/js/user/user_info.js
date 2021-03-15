$(function () {
    // 1.验证
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 9) {
                return '昵称长度为2-9之间'
            }
        }
    });

    initUserInfo();
    // 2.封装:展示用户信息
    let layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            type: 'GET',
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.mas(res.massage)
                }
                // 成功,
                form.val('fromUserInfo', res.data)
            }
        });

    };

    // 3.重置
    // 方案1:
    $('form').on('reset', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    // 方案2:
    // $('#btnReset').on('click', function (e) {
    //     // 阻止重置
    //     e.preventDefault();
    //     // 从新用户渲染
    //     initUserInfo();
    // })

    // 4.提交修改用户信息功能
    $('form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败!')

                }
                layer.msg('恭喜您,用户信息修改成功!')
                // 调用父页面中的更新用户信息和头像方法
                window.parent.getUserInfo();
            }
        });

    })

})