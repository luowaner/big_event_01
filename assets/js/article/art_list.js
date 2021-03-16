$(function () {
    // 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        let dt = new Date(dtStr)
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}:${m}:${d}  ${hh}:${mm}:${ss}
    `
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n

    }
    // 定义提交的参数 接口文档有提供
    let q = {
        pagenum: 1, //	页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '',//文章的状态，可选值有：已发布、草稿
    }

    // 初始化文章列表
    let layer = layui.layer;
    initTable();
    // 封装:
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            type: 'GET',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                // 成功,渲染数据
                let htmlStr = template('tpl-table', { data: res.data });
                $('tbody').html(htmlStr);
                // 调用分页
                renderPage(res.total);
            }
        });
    };

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
    // 筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        let cate_id = $('[name= cate_id]').val();
        let state = $('[name= state]').val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 初始化文章列表
        initTable();
    })
    //5 分页
    var laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,  //每页显示几条
            curr: q.pagenum,//第几页

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5],
            // 页面切换触发这个方法
            jump: function (obj, first) {
                // obj:所有的参数所在的对象,first:是否第一次初始化分页
                // 判断:不是第一次初始化分页,才能重新调用出书画文章列表
                console.log(first, obj.curr, obj.limit);

                if (!first) {
                    q.pagenum = obj.curr;
                    q.pagesize = obj.limit;
                    // 初始化文章列表,重新渲染页面
                    initTable();
                }
            }
        });
    };

    // 6.删除 事件委托
    $('tbody').on('click', '.btn-delete', function () {
        // 获取Id,进入到函数中,改变this代指
        let Id = $(this).attr('data-id');
        // 显示对话框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + Id,
                type: 'GET',
                success: (res) => {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除文章成功!');
                    // 如果当前页面的数据删光了,页面数要减一
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) {
                        q.pagenum--;
                        // 更新数据要重新渲染页面中的数据
                    }
                    initTable();
                }
            });
            layer.close(index);
        });
    })

})