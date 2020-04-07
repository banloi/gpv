import React, { Component } from 'react'
import axios from 'axios'
import qs from 'qs'
import config from '../config'
import histroy from '../history'

class Login extends Component {
  constructor () {
    super()
    this.state = {
      number: '',
      password: '',
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
    const { number, password } = this.state
    axios.post(`${config.baseURL}/user/login`, qs.stringify(
      {
        number: number,
        password: password
      }
    ))
      .then(res => {
        if (res.status === 200) {
          histroy.push('/u/activities')
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
    const { number, password, message } = this.state
    return (
      <div className='login'>
        {message}
        <form onSubmit={this.handleFormSubmit}>
          <div>
            <label>账号</label>
            <input
              value={number}
              name='number'
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
          <input type='submit' value='登录' onClick={this.handleLogin} />
        </form>
        <a href='http://localhost:3001/register'>用户注册</a>
        <a href='http://localhost:3001'>忘记密码(未实现)</a>
      </div>

    )
  }
}

export default Login
