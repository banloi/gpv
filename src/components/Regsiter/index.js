// import PropTypes from 'prop-types'
import React, { Component, useState } from 'react'
// import './index.css'
// axios.defaults.withCredentials = true
// import { Error } from '../index'
import qs from 'qs'
import history from '../history'
import { config, axios } from '../config'
import './index.css'

import {
  Form,
  Input,
  Button,
  Alert
} from 'antd'

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 16
    }
  }
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
}

const Register = () => {
  const [form] = Form.useForm()
  const [message, setMessage] = useState('欢迎注册')
  const [state, setState] = useState('success')

  const onFinish = values => {
    console.log('Received values of form: ', values)
    axios.post(config.url.register, qs.stringify(values))
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
        setState('error')
        setMessage(err.Error)
        /*         if (err.Error === '该用户已注册，请直接登录') {
          setMessage(err.Error + '，2s 后跳转到登录页')
          setTimeout(() => { history.push('/') }, 1000)
        } */
      })
  }

  return (
    <div className='register'>
      <Alert className='alert' message={message} type={state} />
      <Form
        {...formItemLayout}
        form={form}
        name='register'
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name='username'
          label={
            <span>
              学号
            </span>
          }
          rules={[
            {
              required: true,
              message: '请输入学号',
              whitespace: true
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='password'
          label='密码'
          rules={[
            {
              required: true,
              message: '请输入密码'
            }
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='confirm'
          label='确认密码'
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请确认密码'
            },
            ({ getFieldValue }) => ({
              validator (rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }

                return Promise.reject(new Error('两次输入的密码不一样'))
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='telephone'
          label='手机号码'
          rules={[
            {
              required: true,
              message: '请输入手机号码'
            }
          ]}
        >
          <Input
            style={{
              width: '100%'
            }}
          />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>
          Register
          </Button>
        </Form.Item>
      </Form>
    </div>

  )
}

class Registers extends Component {
  constructor (props) {
    super(props)
    this.state = {
      number: '',
      password: '',
      rePassword: '',
      telephone: '',
      checkNum: '',
      checkPas: '',
      checkRepas: '',
      same: '',
      ok: false,
      success: false,
      locationChange: false
    }
    this.handleRegisterClick = this.handleRegisterClick.bind(this)
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
    this.handleNumOnChange = this.handleNumOnChange.bind(this)
    this.handlePasOnChange = this.handlePasOnChange.bind(this)
    this.handleRePasOnChange = this.handleRePasOnChange.bind(this)
    this.handleTeleOnChange = this.handleTeleOnChange.bind(this)
  }

  handleRegisterSubmit (event) {
    event.preventDefault()
  }

  handleRegisterClick () {
    if (!this.state.password) {
      return
    }
    if (this.state.password === this.state.rePassword) {
      this.setState({
        same: ''
      })
    } else if (this.state.password !== this.state.rePassword) {
      this.setState({
        same: '两次数输入的密码不一样'
      })
      return
    }
    /*    const httpRequest = new XMLHttpRequest()
    const data = `number=${this.state.number}&password=${this.state.password}&telephone=${this.state.telephone}`
    if (!httpRequest) {
      console.log('Cannot create an XMLHTTP instance')
      return false
    }
    httpRequest.onreadystatechange = clContents
    httpRequest.open('POST', 'http://localhost:3001/user')
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    // httpRequest.setRequestHeader('Access-Control-Allow-Origin', 'true')
    httpRequest.withCredentials = true
    httpRequest.send(data)

    function clContents () {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 201) {
          this.state.success = true
          console.log(httpRequest.responseText)
        } else {
          console.log(httpRequest.responseText)
        }
      }
    }
    console.log(data)
 */

    /*     // 添加响应拦截器
    ax.interceptors.response.use(function (response) {
      // 对响应数据做点什么
      if (response.status === 201) {
        this.state.success = true
      } else {
        this.state.success = false
      }
    }, function (error) {
      // 对响应错误做点什么
      return Promise.reject(error)
    }) */

    axios.post(config.url.register, qs.stringify(
      {
        number: this.state.number,
        password: this.state.password,
        telephone: this.state.telephone
      }
    ))
      .then(res => {
        if (res.status === 201) {
          this.setState({
            success: true
          })
        }
        history.push('/')
        this.setState({
          locationChange: true
        })
        console.log(history.location)
        console.log(res)
      })
      .catch(e => console.log(e))
  }

  handleNumOnChange (event) {
    this.setState({
      number: event.target.value
    })
  }

  handlePasOnChange (event) {
    this.setState({
      password: event.target.value
    })
  }

  handleRePasOnChange (event) {
    this.setState({
      rePassword: event.target.value
    })
  }

  handleTeleOnChange (event) {
    this.setState({
      telephone: event.target.value
    })
  }

  render () {
    // const { checkNum, checkPas, checkRepas, same, success } = this.state
    const { same } = this.state
    const { number, password, rePassword, telephone } = this.state
    // const { location } = this.props
    return (
      <div className='register'>
        <form onSubmit={this.handleRegisterSubmit}>
          <div className='field'>
            <label>学号</label>
            <input
              value={number}
              placeholder='输入学号'
              type='text'
              name='number'
              required
              onChange={this.handleNumOnChange}
            />
          </div>
          <div className='field'>
            <label>密码</label>
            <input
              value={password}
              placeholder='输入密码'
              type='text'
              name='password'
              required
              onChange={this.handlePasOnChange}
            />
          </div>
          <div className='field'>
            <label>重复密码</label>
            <input
              value={rePassword}
              placeholder='重复密码'
              type='text'
              name='rePassword'
              required
              onChange={this.handleRePasOnChange}
            />
            <span>{same}</span>
          </div>
          <div className='field'>
            <label>电话号码</label>
            <input
              value={telephone}
              placeholder='输入电话号码'
              type='text'
              name='telephone'
              required
              onChange={this.handleTeleOnChange}
            />
          </div>
          <input type='submit' value='注册' onClick={this.handleRegisterClick} />
        </form>
      </div>

    )
  }
}

export default Register
