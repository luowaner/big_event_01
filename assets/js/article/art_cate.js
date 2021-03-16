$(function () {
    // 1文章类别列表显示
    initArtCateList();
    // 封装函数
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: (res) => {
                console.log(res);
                let str = template('t1', { data: res.data });
                $('tbody').html(str)
            }
        });
    };

    // 2.显示添加文章分类列表
    let layer = layui.layer;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px, 250px'],
            content: $('#dialog-add').html(),
        })
    });

    // 3.提交文章分类添加
    let indexAdd = null;
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg('文章类别添加成功!');
                layer.close(indexAdd)
            }
        });
    });

    // 4.修改-展示表单
    let indexEdit = null;
    let form = layui.form;
    // 修改
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px, 250px'],
            content: $('#dialog-edit').html(),
        });
        // 4.2获取ajax
        let Id = $(this).serialize();
        $.ajax({
            url: '/my/article/cates' + Id,
            type: 'GET',
            success: (res) => {
                // console.log(res);
                form.val('form-edit', res.data);
            }
        })
    });

    // 提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/updatecate',
            type: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                };
                // 重新渲染页面
                initArtCateList();
                layer.msg('文章类别更新成功!');
                layer.close(indexEdit);
            }
        })
    })

    // 5.删除
    $('tbody').on('click', '.btn-delete', function (e) {
        let Id = $(this).attr('data-id');
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                type: 'GET',
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 重新渲染页面
                    initArtCateList();
                    layer.msg('文章类别删除成功');
                    layer.close(index);

                }
            })
        })
    });
})