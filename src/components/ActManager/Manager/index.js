import React, { useState, useEffect } from 'react'
import history from '../../history'
import { axios, config } from '../../config'
import qs from 'qs'
import { Button, Form, Input, DatePicker, InputNumber, Radio, Alert, Skeleton, Popconfirm } from 'antd'
import moment from 'moment'
import { Enrollments } from '../index'
import './index.css'

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

function ActManager (props) {
  const [module, setModule] = useState('A')
  const [btnState, setBtnState] = useState(true) // 默认禁用btn，修改后方可提交
  const [form] = Form.useForm()
  const [result, setResult] = useState('success')
  const [message, setMessage] = useState('修改活动信息')
  const [initialData, setInitaiaData] = useState({}) // 设置表单初始值
  const [initialState, setInitailState] = useState(true) // 是否挂载组件

  function getInfo () {
    axios.get(config.url.getActivityInfo, {
      params: {
        id: props.id
      }
    }).then(res => {
      console.log(res)
      const data = res.data
      setInitaiaData({
        name: data.name,
        location: data.location,
        actTime: [moment(data.startTime), moment(data.endTime)],
        enroDeadLine: moment(data.enroDeadLine),
        limiteOfStu: data.limiteOfStu,
        module: data.module,
        detail: data.detail
      })
      setInitailState(false)
    }).catch(e => {
      console.log(e)
    })
  }
  useEffect(getInfo, [])
  function handleChange (e) {
    console.log('radio checked', e.target.value)
    setModule(e.target.value)
  }

  function handleModified () {
    setBtnState(false)
  }

  function handleFinish (fieldsValue) {
    console.log(fieldsValue)
    const rangeTimeValue = fieldsValue.actTime
    const values = {
      ...fieldsValue,
      enroDeadLine: fieldsValue.enroDeadLine.format('YYYY-MM-DD HH:mm:ss'),
      startTime: rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
      _id: props.id
    }
    delete values.actTime
    axios
      .put(config.url.putActivityInfo, qs.stringify(values))
      .then(res => {
        console.log(res)
        setMessage(res.data.message)
        setBtnState(true)
        setResult('success')
      })
      .catch(e => {
        setMessage(e.Error)
        setBtnState(false)
        setResult('error')
      })
    setBtnState(true)
  }

  function handleCancel () {
    console.log('删除', props.id)
    axios.delete(config.url.deleteActivity, {
      params: {
        activityId: props.id
      }
    })
    history.replace('/a/act/enrolling')
  }

  return (
    <div className='enroForm'>
      <Skeleton
        loading={initialState}
      >
        <Form
          form={form}
          {...layout}
          onFinish={handleFinish}
          onFieldsChange={handleModified}
          initialValues={initialData}
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
          <Popconfirm title='确认删除？删除后无法撤销' onConfirm={() => handleCancel()}>
            <Button danger block>删除活动</Button>
          </Popconfirm>
        </Form>
      </Skeleton>
    </div>
  )
}

function Manager (props) {
  const id = props.match.params.id
  const [type, setType] = useState(true)
  const [switchTo, setSwitchTo] = useState('切换为报名管理')

  function handleSwitch () {
    if (type) {
      setType(false)
      setSwitchTo('切换为活动管理')
    } else {
      setType(true)
      setSwitchTo('切换为报名管理')
    }
  }
  function handleBack () {
    history.push('/a/act/enrolling')
  }

  return (
    <div id='container'>
      <div className='manager-nav'>
        <Button
          onClick={handleBack}
        >
          返回活动列表
        </Button>
        <Button
          className='left-btn'
          onClick={handleSwitch}
        >{`${switchTo}`}
        </Button>
      </div>

      {
        type
          ? <ActManager id={id} />
          : <Enrollments activityId={id} />

      }
    </div>
  )
}

export default Manager
