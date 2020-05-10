import React, { Component } from 'react'
import { Form, Input, Button, Radio, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import qs from 'qs'
import { config, axios } from '../config'
import history from '../history'
import './index.css'

class Login extends React.Component {
  constructor () {
    super()
    this.state = {
      message: '欢迎回来',
      state: 'success',
      userType: 'user'
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleFinish = this.handleFinish.bind(this)
  }

  handleChange (e) {
    console.log('radio checked', e.target.value)
    this.setState({
      userType: e.target.value
    })
  }

  handleFinish (values) {
    console.log('Received values of form: ', values)
    const { userType } = this.state
    let url
    if (userType === 'user') {
      url = config.url.userLogin
    } else if (userType === 'adm') {
      url = config.url.admLogin
    }
    axios.post(url, qs.stringify(values))
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
            message: e.Error,
            state: 'error'
          })
        }
      ) // 返回 400 时，数据是 err.response
  }

  render () {
    const { message, state } = this.state
    return (
      <Form
        name='normal_login'
        className='login-form'
        initialValues={{ remember: true }}
        onFinish={this.handleFinish}
      >
        <Alert className='alert' message={message} type={state} />

        <Form.Item
          name='username'
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='用户名' />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='密码'
          />
        </Form.Item>
        <Form.Item>
          <Radio.Group onChange={this.handleChange} value={this.state.userType}>
            <Radio value='user'>普通用户</Radio>
            <Radio value='adm'>管理员</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' className='login-form-button'>
          登录
          </Button>
          <a href='http://localhost:3001/register'>注册</a>
          <a className='login-form-forgot' href=''>
            忘记密码
          </a>
        </Form.Item>
      </Form>
    )
  }
}

class Logins extends Component {
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
    let url
    if (type === 'user') {
      data = {
        number: accout,
        password: password
      }
      url = config.url.userLogin
    } else if (type === 'adm') {
      data = {
        name: accout,
        password: password
      }
      url = config.url.admLogin
    }
    axios.post(url, qs.stringify(data))
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
            message: e.Error
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
