import React, { Component, useState } from 'react'
import './index.css'
import history from '../../history'
import { config, axios } from '../../config'
import qs from 'qs'

import { Form, Input, InputNumber, Button, DatePicker, Radio, Alert } from 'antd'
const { RangePicker } = DatePicker
const { TextArea } = Input
const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
const configs = {
  rules: [{ type: 'object', required: true, message: '请选择报名截止时间' }]
}
const rangeConfig = {
  rules: [{ type: 'array', required: true, message: '请选择活动时间' }]
}

function CreateAct () {
  const [module, setModule] = useState('A')
  const [btnState, setBtnState] = useState(false)
  const [form] = Form.useForm()
  const [result, setResult] = useState('success')
  const [message, setMessage] = useState('请输入活动信息')

  function handleChange (e) {
    console.log('radio checked', e.target.value)
    setModule(e.target.value)
  }

  function handleFinish (fieldsValue) {
    console.log(fieldsValue)
    const rangeTimeValue = fieldsValue.actTime
    const values = {
      ...fieldsValue,
      enroDeadLine: fieldsValue.enroDeadLine.format('YYYY-MM-DD HH:mm:ss'),
      startTime: rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss')
    }
    delete values.actTime
    axios
      .post(config.url.postActivity, qs.stringify(values))
      .then(res => {
        console.log(res)
        setBtnState(false)
        setMessage('创建成功')
        setResult('success')
        form.resetFields()
      })
      .catch(e => {
        setMessage(e.Error)
        setBtnState(false)
        setResult('error')
      })
    setBtnState(true)
  }
  const initialValues = {
    name: '',
    location: '',
    actTime: ['', ''],
    enroDeadLine: '',
    limiteOfStu: 0,
    module: 'A',
    detail: ''
  }
  return (
    <div id='container'>
      <Form
        form={form}
        {...layout}
        onFinish={handleFinish}
      >
        <Alert className='alert' message={message} type={result} />
        <Form.Item
          label='活动名'
          name='name'
          rules={[{ required: true, message: '请输入活动名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='地点'
          name='location'
          rules={[{ required: true, message: '请输入活动地点' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='actTime' label='活动时间' {...rangeConfig}>
          <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' />
        </Form.Item>
        <Form.Item name='enroDeadLine' label='报名截止时间' {...configs}>
          <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
        </Form.Item>
        <Form.Item
          label='人数上限'
          name='limiteOfStu'
          required
          rules={[{ required: true, message: '请输入活动人数上限' }]}
        >
          <InputNumber min={1} max={9999} initialValues={1} />
        </Form.Item>
        <Form.Item
          label='选择模块'
          name='module'
          rules={[{ required: true, message: '请选择模块' }]}
        >
          <Radio.Group onChange={handleChange} value={module}>
            <Radio value='A'>模块A</Radio>
            <Radio value='B'>模块B</Radio>
            <Radio value='C'>模块C</Radio>
            <Radio value='D'>模块D</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label='详情'
          name='detail'
          rules={[{ required: true, message: '请输入活动介绍' }]}
        >
          <TextArea
            placeholder='介绍活动详情'
            autoSize={{ minRows: 3, maxRows: 15 }}
          />
        </Form.Item>
        <Button type='primary' htmlType='submit' disabled={btnState} className='login-form-button'>
          提交
        </Button>
      </Form>
    </div>
  )
}

export default CreateAct
