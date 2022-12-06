$(function () {
  // 点击‘去注册账号’的链接
  $('#link_reg').on('click', function () {
    $('.reg-box').show()
    $('.login-box').hide()
  })

  // 点击‘去登录’的链接
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  // 从 layui 中获取 form 对象   layui属于导入的插件中的变量  类似于jQuery中的$
  let form = layui.form
  // layui中的提示框组件  layer.msg()
  let layer = layui.layer
  // 通过 form.verify() 函数自定义校验规则
  form.verify({
    // 自定义了一个叫做 pwd 的校验规则  \S 代表不是空格的字符  不符合正则会提示数组中的第二项
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容 进行一次等于判断
      // 如果判断失败，则return一个提示消息即可
      let pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }

  })

  // 把接口的根路径封装起来
  // let A = 'http://www.liulongbin.top:3007'
  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    // 1. 阻止默认的提交行为
    e.preventDefault()
    let data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    // 2. 发起Ajax的POST请求
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)

      }
      layer.msg('注册成功，请登录！')
      // 注册完之后自动跳转到登录页面  调用点击事件
      $('#link_login').click()
    })
  })

  // 监听登录表单的提交事件
  $('#form_login').submit(function (e) {
    // 阻止默认行为
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败')
        }
        layer.msg('登录成功')
        // 将登陆成功得到的 token 字符串，保存到 localStorage(本地存储) 中
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = './index.html'
      }
    })

  })
})