import React, { Component, useState, useEffect } from 'react'
import { config, axios } from '../../config'
import { Table, Button } from 'antd'
import Column from 'antd/lib/table/Column'
import history from '../../history'

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
    width: '20%'
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
    title: '表现',
    dataIndex: 'performance',
    key: 'performance',
    width: '20%'
  },
  {
    title: '得分',
    dataIndex: 'score',
    key: 'score'
  }
]

function ScoreTable (props) {
  const [data, setData] = useState([])
  function getData () {
    console.log(data)
    axios.get(config.url.getScore, {
      params: {
        activityId: props.match.params.id
      }
    })
      .then(res => {
        console.log(res.data)
        let formated = {}
        let items = []
        res.data.forEach(item => {
          formated.key = item._id
          formated.score = item.score
          formated.performance = item.performance
          formated = { ...formated, ...item.studentInfo }
          items = [...items, formated]
        })
        setData(items)
      })
      .catch(e => console.log(e))
    console.log(data)
  }
  useEffect(getData, [])
  function handleBack () {
    history.push('/a/act/done')
  }

  return (
    <div id='container'>
      <Button
        onClick={handleBack}
      >
        返回活动列表
      </Button>
      <Table dataSource={data} className='enroForm'>
        <Column {...columns[0]} />
        <Column {...columns[1]} />
        <Column {...columns[2]} />
        <Column {...columns[3]} />
        <Column {...columns[4]} />
        <Column {...columns[5]} />
      </Table>
    </div>

  )
}

export default ScoreTable
