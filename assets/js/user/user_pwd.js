$(function () {
  let form = layui.form
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    // 这里的形参 value 就是所添加这个规则的表单里面的值
    samePwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同'
      }
    },
    rePwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码不一致'
      }
    }

  })

  $('.layui-form').on('submit', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('更新密码失败')
        }
        layui.layer.msg('更新密码成功')

        // 重置表单 dom方法  [0] 可以把jQuery对象转为dom元素
        $('.layui-form')[0].reset()
      }
    })
  })
})