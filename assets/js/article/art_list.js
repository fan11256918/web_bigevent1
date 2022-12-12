$(function () {
  let layer = layui.layer
  let form = layui.form
  let laypage = layui.laypage;

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    let y = dt.getFullYear()
    let m = padZero(dt.getMonth() + 1)
    let d = padZero(dt.getDay())

    let hh = padZero(dt.getHours())
    let mm = padZero(dt.getMinutes())
    let ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
  }


  // 定义补零的函数
  function padZero(n) {
    n > 9 ? n : '0' + n
  }

  // 定义一个查询的参数对象，将来请求数据的时候需要将参数对象提交到服务器
  let p = {
    pagenum: 1,  // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '',  // 文章分类的 Id  
    state: '' // 文章的发布状态
  }


  initTable()
  initCate()

  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: p,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败')
        }
        // 使用模板引擎渲染页面的数据
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法  total是数据总数的变量
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章失败')
        }
        let htmlStr = template('tpl-cate', res)
        console.log(htmlStr);
        $('[name=cate_id]').html(htmlStr)
        // 通过 layui 重新渲染表单区域的ui结构
        form.render()
      }
    })
  }

  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取表单中选中项的值
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox',  // 分页容器的ID
      count: total,     // 总数居条数
      limit: p.pagesize,  // 每页显示几条数据
      curr: p.pagenum,    // 指定默认被选中的分页
      // 在 layui 官网中 自定义排版有说明
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候，会触发 jump 回调
      // 2. 只要调用了 laypage.render() 方法 就会触发 jump 回调
      jump: function (obj, first) {
        // 可以通过 first 的值，来判断是通过那种方式触发的jump回调
        // 如果 first 的值为true，证明是方式2触发的 如果是undefined 就证明是方式1触发的
        console.log(first)
        console.log(obj.curr)  // 得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数
        // 把最新的页码值，赋值到 p 这个查询参数对象中
        p.pagenum = obj.curr
        // 把最新的条目数，赋值到 p 这个查询参数对象的 pagesize属性中  切换条目中 也会发生 jump 回调
        p.pagesize = obj.limit
        // 根据最新的 p 获取对应的数据列表，并渲染表格
        if (!first) {
          initTable()
        }
      }
    })
  }

  // 通过代理的形式，为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数
    let len = $('.btn-delete').length
    console.log(len)
    // 获取到文章的 id
    let id = $(this).attr('data-id')
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败')
          }
          layer.msg('删除文章成功')
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余数据，如果没有剩余数据，则让页码值-1之后，再重新调用 initTable 方法
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是1
            p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index);
    });
  })
})