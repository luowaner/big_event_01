$(function () {
    // 1.定义密码校验规则
    let form = layui.form;
    form.verify({
        // 密码
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 1.2.新旧密码不重复
        samePwd: function (value) {
            //value是旧密码
            if (value == $('[name=oldPwd]').val()) {
                return "新密码和原密码不能相同"
            }
        },
        // 1.3确认新密码和新密码必须一致, 否则不执行, 提示用户
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "两次密码输入不一致"
            }
        },
    });

    // 2.表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg('修改密码成功');
                $('.layui-form')[0].reset();
            }
        });

    })
})