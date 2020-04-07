// import PropTypes from 'prop-types'
import React, { Component } from 'react'
// import './index.css'
import axios from 'axios'
// axios.defaults.withCredentials = true
import { Error } from '../index'
import qs from 'qs'
import history from '../history'
import config from '../config'

class Register extends Component {
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
    const ax = axios.create({
      // baseURL: 'http:www.xxx.com/api',
      timeout: 30000,
      withCredentials: true, // 允许携带cookie
      proxy: {
        host: '127.0.0.1',
        port: 3000
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

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

    ax.post(`${config.baseURL}/user`, qs.stringify(
      {
        number: this.state.number,
        password: this.state.password,
        telephone: this.state.telephone
      }
    ))
      .then(res => {
        if (res.status === 201) {
          this.state.success = true
        }
        history.push('/')
        this.state.locationChange = true
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
    const { checkNum, checkPas, checkRepas, same, success } = this.state
    const { number, password, rePassword, telephone } = this.state
    const { location } = this.props
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
