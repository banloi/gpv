import React, { Component } from 'react'
import axios from 'axios'
import qs from 'qs'
import config from '../config'
import history from '../history'

class Login extends Component {
  constructor () {
    super()
    this.state = {
      accout: '',
      password: '',
      type: 'user',
      message: '请登录'
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleInput (event) {
    const name = event.target.name
    this.setState({
      [name]: event.target.value
    })
  }

  // 阻止刷新
  handleFormSubmit (event) {
    event.preventDefault()
  }

  // 登录操作
  handleLogin () {
    const { accout, password, type } = this.state
    let data
    if (type === 'user') {
      data = {
        number: accout,
        password: password
      }
    } else if (type === 'adm') {
      data = {
        name: accout,
        password: password
      }
    }
    axios.post(`${config.baseURL}/${type}/login`, qs.stringify(data))
      .then(res => {
        if (res.status === 200) {
          if (res.data.type === 'user') {
            history.push('/u/activities')
          } else if (res.data.type === 'actAdm') {
            history.push('/a/act/new')
          } else if (res.data.type === 'userAdm') {
            history.push('/a/user')
          }
        } else if (res.status === 400) {
          console.log(res.json)
        }
      })
      .catch(
        e => {
          this.setState({
            message: e.response.data.Error
          })
        }
      ) // 返回 400 时，数据是 err.response
  }

  render () {
    const { accout, password, message } = this.state
    return (
      <div className='login'>
        {message}
        <form onSubmit={this.handleFormSubmit}>
          <div>
            <label>账号</label>
            <input
              value={accout}
              name='accout'
              onChange={this.handleInput}
              placeholder='输入账号'
              type='text'
              required
            />
          </div>
          <div>
            <label>密码</label>
            <input
              value={password}
              name='password'
              onChange={this.handleInput}
              placeholder='输入密码'
              type='password'
              required
            />
          </div>
          <div>
            <input type='radio' value='user' name='type' id='user' checked onChange={this.handleInput} />
            <label>用户</label>
            <input type='radio' value='adm' name='type' id='adm' onChange={this.handleInput} />
            <label>管理员</label>
          </div>
          <input type='submit' value='登录' onClick={this.handleLogin} />
        </form>
        <a href='http://localhost:3001/register'>用户注册</a>
        <a href='http://localhost:3001'>忘记密码(未实现)</a>
      </div>

    )
  }
}

export default Login
