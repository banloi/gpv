import React, { Component, useEffect, useState } from 'react'
import history from '../../history'
// import { Route, Router, Link, Switch } from 'react-router-dom'
import { config, axios } from '../../config'
import qs from 'qs'
import { Upload, message, Button, Table } from 'antd'
import Column from 'antd/lib/table/Column'
import { UploadOutlined } from '@ant-design/icons'
import './index.css'

function AddStudents () {
  const [data, setData] = useState([])
  const [disable, setDisble] = useState(true)
  const props = {
    name: 'file',
    action: config.url.postExcel,
    method: 'POST',
    headers: {
      authorization: 'authorization-text'
    },
    onChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
        info.file.response.forEach(item => {
          item.key = item.number
        })
        console.log(info.file.response)
        setData(info.file.response)
        setDisble(false)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
        setDisble(true)
      }
    }
  }
  function onSubmit () {
    if (data.length === 0) {
      setDisble(true)
      return
    }
    axios.post(config.url.postStudents, qs.stringify(data))
      .then(res => {
        console.log(res)
        setDisble(false)
        message.success('提交成功')
        setData([])
      })
      .catch(err => {
        console.log(err)
        message.error('提交失败')
        setDisble(false)
      })
    setDisble(true)
  }
  return (
    <div>

      <Table dataSource={data} className='enroForm'>
        <Column {...columns[0]} />
        <Column {...columns[1]} />
        <Column {...columns[2]} />
        <Column {...columns[3]} />
        <Column {...columns[4]} />
      </Table>
      <div className='add-container'>
        <div className='left'>
          <Upload {...props}>
            <Button>
              <UploadOutlined /> 上传 Excel 文件
            </Button>
          </Upload>
        </div>
        <div className='right'>
          <Button
            disabled={disable}
            onClick={onSubmit}
          >
        确认提交
          </Button>
        </div>
      </div>
    </div>
  )
}

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: '13%'
  },
  {
    title: '学号',
    dataIndex: 'number',
    key: 'number',
    width: '16%'
  },
  {
    title: '班级',
    dataIndex: 'class',
    key: 'class',
    width: '15%'
  },
  {
    title: '学院',
    dataIndex: 'school',
    key: 'school',
    width: '22%'
  },
  {
    title: '年级',
    dataIndex: 'grade',
    key: 'grade',
    width: '20%'
  }

]

export default AddStudents
