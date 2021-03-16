$(function () {
    // 初始化文章分类
    let form = layui.form;
    initCate();
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'GET',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 赋值,渲染form
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        });
    };
    // 2,初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    let $image = $('#image')

    // 3.2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)


    // 4点击按钮,选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();

    });

    // 5.设置图片
    $('#coverFile').change(function (e) {
        // 获取用户选择的文件
        let file = e.target.files[0];
        // 非空校验
        if (file == undefined) {
            return;
        }
        let newImgURL = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 6设置状态
    let state = '已发布';
    // $('#btnSave1').on('click',function () {
    //     state='已发布';

    // })
    $('#btnSave2').on('click', function () {
        state = '草稿';
    });

    // 7.文章发布
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        let fd = new FormData(this);
        fd.append('state', state);
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                console.log(...fd);

                // 要封装发布文章的ajax
                publicArticle(fd);
            });
    });

    // 封装:
    function publicArticle(fd) {
        $.ajax({
            url: '/my/article/add',
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('发布文章成功')
                // location.href = '/article/art_list.html'
                // 跳转
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click()

                }, 1500)
            }
        });

    }
})