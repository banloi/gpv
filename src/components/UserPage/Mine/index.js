import React, { useState, useEffect } from 'react'
import qs from 'qs'
import { config, axios } from '../../config'
import history from '../../history'
import './index.css'
import { Button, Input, Form, Alert, Popconfirm } from 'antd'

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

function Minee () {
  const [message, setMessage] = useState('修改密码')
  const [result, setResult] = useState('success')
  const [btnState, setBtnState] = useState(false)
  const [form] = Form.useForm()
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

function Mine () {
  const [studentInfo, setStudentInfo] = useState([])
  const [score, setScore] = useState([])
  const [telephone, setTelephone] = useState('')
  const [moduleScore, setModuleScore] = useState({})
  useEffect(getInfo, [])
  function getInfo () {
    axios.get(config.url.getUserInfo)
      .then(
        (res) => {
          const data = res.data
          setScore(data.score)
          setStudentInfo(data.info)
          setTelephone(data.telephone)
          // history.push('/u/user/enro')
          console.log(res)
        })
      .catch(err => {
        console.log(err.response)
        if (err.Error === '请先登录') {
          history.push('/')
        }
      })
  }
  function trimScore () {
    moduleScore.A = 0
    moduleScore.B = 0
    moduleScore.C = 0
    moduleScore.D = 0
    moduleScore.all = 0
    score.forEach(item => {
      moduleScore.all += item.score
      moduleScore[item.activityInfo.module] += item.score
      setModuleScore(moduleScore)
    })
  }

  useEffect(trimScore, [score])
  return (
    <div>
      <div className='register'>
        <div className='userName'>
          <span className='item'>姓名</span><span className='info'>{studentInfo.name}</span>
        </div>
        <div className='number'>
          <span className='item'>学号</span><span className='info'>{studentInfo.number}</span>
        </div>
        <div className='telephone'>
          <span className='item'>手机号</span><span className='info'>{telephone}</span>
        </div>
        <div>
          <span className='item'>班级</span><span className='info'>{studentInfo.class}</span>
        </div>
        <div>
          <span className='item'>学院</span><span className='info'>{studentInfo.school}</span>
        </div>
        <div className='moduleScore'>
          <div className='Module'><span className='item'>总分</span><span className='value'>{moduleScore.all}</span></div>
          <div className='Module'><span className='item'>A模块</span><span className='value'>{moduleScore.A}</span></div>
          <div className='Module'><span className='item'>B模块</span><span className='value'>{moduleScore.B}</span></div>
          <div className='Module'><span className='item'>C模块</span><span className='value'>{moduleScore.C}</span></div>
          <div className='Module'><span className='item'>D模块</span><span className='value'>{moduleScore.D}</span></div>
        </div>
      </div>
      <Minee />
    </div>
  )
}
export default Mine
