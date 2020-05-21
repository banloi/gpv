import React, { useState, useEffect } from 'react'
import './index.css'
import { config, axios } from '../../config'
import qs from 'qs'

import { Table, Input, Button, Popconfirm, Form, Alert } from 'antd'

import Column from 'antd/lib/table/Column'
const layout = {
  labelCol: {
    span: 2
  },
  wrapperCol: {
    span: 8
  }
}
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: '15%'
  },
  {
    title: '学号',
    dataIndex: 'number',
    key: 'number',
    width: '20%'
  },
  {
    title: '班级',
    dataIndex: 'class',
    key: 'class',
    width: '20%'
  },
  {
    title: '学院',
    dataIndex: 'school',
    key: 'school',
    width: '25%'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: '20%'
  }
]

function Enrollments (props) {
  const [data, setData] = useState([])
  const [btnState, setBtnState] = useState(false)
  const [form] = Form.useForm()
  const [addMessage, setAddmessage] = useState('添加报名')
  const [addResult, setAddResult] = useState('success')

  const [cancelBtn, setCancelBtn] = useState('删除')
  function getData () {
    console.log(data)
    axios.get(config.url.getEnrollment, {
      params: {
        activityId: props.activityId
      }
    })
      .then(res => {
        console.log(res.data)
        let formated = {}
        let items = []
        res.data.forEach(item => {
          formated.key = item._id
          formated.state = {
            btnDisable: false,
            message: '删除'
          }
          formated = { ...formated, ...item.studentInfo }
          items = [...items, formated]
        })
        setData(items)
      })
      .catch(e => console.log(e))
    console.log(data)
  }
  useEffect(getData, [])

  function handleAdd (values) {
    const enrollment = { ...values, activityId: props.activityId }
    axios.post(config.url.postAdmEnro, qs.stringify(enrollment))
      .then(res => {
        console.log(res)
        setAddResult('success')
        setAddmessage(res.data.message)
        const { message, ...info } = res.data
        const items = JSON.parse(JSON.stringify(data))
        const item = {}
        item.key = info.enrollId
        item.name = info.name
        item.number = info.number
        item.class = info.class
        item.school = info.school
        item.state = {
          btnDisable: false,
          message: '删除'
        }
        items.unshift(item)
        setData(items)
        form.resetFields()
      })
      .catch(err => {
        console.log(err.Error)
        setAddResult('error')
        setAddmessage(err.Error)
      })
  }

  function handleCancel (record) {
    console.log(data)
    const items = JSON.parse(JSON.stringify(data))
    const index = data.indexOf(record)
    const item = items[index]
    item.name = 'dada'
    item.state = {
      btnDisable: true,
      message: '已删除'
    }
    console.log(data)
    items.splice(index, 1, item)
    setData(items)

    axios.post(config.url.cancelEnro, qs.stringify({
      _id: record.key,
      activityId: props.activityId
    }))
      .then(res => {
        console.log(res)
        console.log(data.indexOf(record))
        const index = data.indexOf(record) // 获取数组索引
        const items = JSON.parse(JSON.stringify(data)) // 深拷贝
        const item = items[index] // 找到相关项
        item.state = {
          btnDisable: true,
          message: '已删除'
        }
        items.splice(index, 1, item) // 保存设置
        setData(items) // 更新组件
      })
      .catch(err => {
        console.log(err)
        const item = data[data.indexOf(record)]
        console.log(data)
        item.state = {
          btnDisable: false,
          message: err.Message
        }
      })
  }

  return (
    <div className='enrollment-table'>
      <div className='enroForm'>
        <Form
          form={form}
          {...layout}
          onFinish={handleAdd}
        >
          <Alert className='alert' message={addMessage} type={addResult} />
          <Form.Item
            label='学号'
            name='number'
            rules={[{ required: true, message: '请输入学号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='姓名'
            name='name'
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Button type='primary' htmlType='submit' disabled={btnState}>
          添加
          </Button>
        </Form>
      </div>

      <Table dataSource={data}>
        <Column {...columns[0]} />
        <Column {...columns[1]} />
        <Column {...columns[2]} />
        <Column {...columns[3]} />
        <Column
          {...columns[4]}
          render={(text, record, index) => (
            <Popconfirm title='确认删除?' disabled={record.state.btnDisable} onConfirm={() => handleCancel(record)}>
              <Button disabled={record.state.btnDisable} danger>{record.state.message}</Button>
            </Popconfirm>
          )}
        />
      </Table>
    </div>

  )
}

export default Enrollments
