// import PropTypes from 'prop-types'
import React, { useState } from 'react'
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
        setState('success')
        setMessage('注册成功')
        history.replace('/u/all')
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
          name='number'
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

export default Register
