import React, { useState, useEffect } from 'react'
import history from '../../history'
import { axios, config } from '../../config'
import qs from 'qs'
import { Button, Form, Input, DatePicker, InputNumber, Radio, Alert, Skeleton, Popconfirm } from 'antd'
import './index.css'

function StudentManager (props) {
  const [btnState, setBtnState] = useState(true) // 默认禁用btn，修改后方可提交
  const [form] = Form.useForm()
  const [result, setResult] = useState('success')
  const [message, setMessage] = useState('修改学生信息')
  const [initialData, setInitaiaData] = useState({}) // 设置表单初始值
  const [initialState, setInitailState] = useState(true) // 是否挂载组件
  const [able, setAble] = useState(true)

  function handleFinish (fieldsValue) {
    console.log(fieldsValue)
    fieldsValue._id = props.id
    axios
      .put(config.url.putStudent, qs.stringify(fieldsValue))
      .then(res => {
        console.log(res)
        setMessage(res.data.message)
        setBtnState(true)
        setResult('success')
      })
      .catch(e => {
        console.log(e)
        setMessage(e.Error)
        setBtnState(false)
        setResult('error')
      })
    setBtnState(false)
  }
  function handleModified () {
    if (able) {
      setBtnState(false)
    }
  }
  function getInfo () {
    axios.get(config.url.getStudent, {
      params: props.id
    })
      .then(res => {
        console.log(res)
        setInitaiaData(res.data[0])
        setInitailState(false)
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(getInfo, [])

  function handleCancel () {
    console.log('删除', props.id)
    axios.delete(config.url.deleteStudent, {
      params: {
        _id: props.id
      }
    })
    history.replace('/a/user/manage')
  }

  return (
    <div className='enroForm'>
      <Skeleton
        loading={initialState}
      >
        <Form
          form={form}
          initialValues={initialData}
          onFieldsChange={handleModified}
          onFinish={handleFinish}
        >
          <Alert className='alert' message={message} type={result} />
          <Form.Item
            label='姓名'
            name='name'
            rules={[{ required: true, message: '姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='学号'
            name='number'
            rules={[{ required: true, message: '请输入学号' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label='班级'
            name='class'
            rules={[{ required: true, message: '请输入班级' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='学院'
            name='school'
            rules={[{ required: true, message: '请输入学院' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='年级'
            name='grade'
            rules={[{ required: true, message: '请输入年级' }, {
              pattern: /^20[0-9]{2}$/, message: '请输入正确的年级'
            }]}
          >
            <Input />
          </Form.Item>

          <Button type='primary' htmlType='submit' disabled={btnState} className='login-form-button'>
            提交
          </Button>
          <Popconfirm title='确认删除？删除后无法撤销' onConfirm={() => handleCancel()}>
            <Button danger block>删除学生</Button>
          </Popconfirm>
        </Form>
      </Skeleton>
    </div>
  )
}

function StudentInfo (props) {
  const id = props.match.params.id
  function handleBack () {
    console.log('back')
    history.push('/a/user/manage')
  }

  return (
    <div id='container'>
      <div className='manager-nav'>
        <Button
          onClick={handleBack}
        >
          返回学生列表
        </Button>
      </div>
      <StudentManager id={id} />
    </div>
  )
}

export default StudentInfo
