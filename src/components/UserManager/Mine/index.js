import React, { useState, useEffect } from 'react'
import { Button, Input, Form, Alert, Popconfirm } from 'antd'
import qs from 'qs'
import { config, axios } from '../../config'
import history from '../../history'

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

function Mine () {
  const [message, setMessage] = useState('修改密码')
  const [result, setResult] = useState('success')
  const [btnState, setBtnState] = useState(false)
  function handleLogout () {
    window.localStorage.removeItem('luffy_jwt_token')
    history.replace('/')
  }
  function handleModified () {
    setBtnState(false)
  }
  function handleFinish (fieldsValue) {
    console.log(fieldsValue)
    axios.put(config.url.putAdmPassword, qs.stringify(fieldsValue))
      .then(res => {
        console.log(res)
        handleLogout()
      })
      .catch(err => {
        console.log(err)
        setMessage(err.Error)
        setResult('error')
      })
    setBtnState(true)
  }
  return (
    <div className='register'>
      <div>
        <Form
          {...formItemLayout}
          onFieldsChange={handleModified}
          onFinish={handleFinish}
        >
          <Alert className='alert' message={message} type={result} />
          <Form.Item
            name='oldPassword'
            label='原密码'
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password placeholder='输入原密码' />
          </Form.Item>
          <Form.Item
            name='password'
            label='密码'
            rules={[
              {
                required: true,
                message: '请输入新密码'
              },
              {
                min: 8,
                message: '密码不能少于8个字符'
              }
            ]}
            hasFeedback
          >
            <Input.Password placeholder='输入新密码' />
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
            <Input.Password placeholder='再次输入新密码' />
          </Form.Item>

          <Button type='primary' htmlType='submit' disabled={btnState} className='login-form-button'>
            提交
          </Button>
        </Form>
      </div>
      <Popconfirm title='确认退出' onConfirm={() => handleLogout()}>
        <Button className='login-form-button' danger>退出登录</Button>
      </Popconfirm>

    </div>
  )
}
export default Mine
