$(function () {
  let form = layui.form
  let layer = layui.layer

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称必须在 1 ~ 6 个字符之间 '
      }
    }
  })

  initUserInfo()

  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败')
        }
        console.log(res)

        // 调用layui中的 form.val() 快速为表单赋值 第一个参数为form表单中的lay-filter属性的值，意思是为有这个属性值的表单赋值，第二个参数为要赋值的对象参数
        form.val('formUserInfo', res.data)
      }
    })
  }

  $('#btnReset').on('click', function (e) {
    // 阻止默认行为
    e.preventDefault()
    initUserInfo()
  })

  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败')
        }
        console.log('更新用户信息成功');
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
      }
    })
  })
})