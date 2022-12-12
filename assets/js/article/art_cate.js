$(function () {
  let layer = layui.layer
  let form = layui.form

  initArtCateList()

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  let indexAdd = null
  // 为添加类别绑定点击事件
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过代理的形式（事件委托）为form-add表单绑定 submit 事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('新增文章分类失败')
        }
        initArtCateList()
        layer.msg('新增文章分类成功')
        layer.close(indexAdd)
      }
    })
  })


  // 通过代理的形式，为btn-edit按钮绑定点击事件
  let indexEdit = null
  $('tbody').on('click', '#btn-edit', function () {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })


    let id = $(this).attr('data-Id')
    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data)
      }

    })
  })


  // 通过代理的形式，为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改失败')
        }
        layer.msg('修改成功')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })

  // 通过代理的形式，为删除按钮绑定 点击 事件
  $('body').on('click', '.btn-delete', function () {
    let id = $(this).attr('data-id')
    // 提示用户是否要删除  layui中的组件  点击确定会执行后面函数中的数据  点击取消不执行 没有任何反应
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败')
          }
          layer.msg('删除成功')
          layer.close(index);
          initArtCateList()
        }
      })
    })
  })
})