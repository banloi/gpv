import React, { Component } from 'react'
import axios from 'axios'
import history from '../../history'
import config from '../../config'
import { Activity } from '../index'

class Done extends Component {
  constructor () {
    super()
    this.state = {
      list: []
    }
    this.getDone = this.getDone.bind(this)
  }

  componentDidMount () {
    this.getDone()
  }

  getDone () {
    axios.get(`${config.baseURL}/activity/done`)
      .then(res => {
        console.log(res)
        this.setState({
          list: res.data
        })
      }).catch(err => {
        console.log(err.response)
        if (err.response && err.response.data.Error && err.response.data.Error === '请先登录') {
          history.push('/')
        } else (console.log(err))
      })
  }

  render () {
    const { list } = this.state
    return (
      list.map((item) => {
        return (
          <div className='activities' key={item._id}>
            <Activity
              item={item}
              Component={ScoreTable}
            />
          </div>
        )
      })
    )
  }
}

class ScoreTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: []
    }
    this.getScore = this.getScore.bind(this)
  }

  getScore () {
    axios.get(
      `${config.baseURL}/score/Adm`, {
        params: {
          activityId: this.props.activityId
        }
      }
    )
      .then(res => {
        console.log(res)
        this.setState({
          list: res.data
        })
      })
      .catch(e => console.log(e))
  }

  componentDidMount () {
    this.getScore()
  }

  render () {
    const { list } = this.state

    if (list.length === 0) {
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>姓名</th>
                <th>学号</th>
                <th>班级</th>
                <th>学院</th>
                <th>年级</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      console.log(list)
      console.log(list instanceof Array)
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>姓名</th>
                <th>学号</th>
                <th>班级</th>
                <th>学院</th>
                <th>年级</th>
                <th>表现</th>
                <th>分数</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => {
                return (
                  <tr key={item._id}>
                    <td>{item.studentInfo.name}</td>
                    <td>{item.studentInfo.number}</td>
                    <td>{item.studentInfo.class}</td>
                    <td>{item.studentInfo.school}</td>
                    <td>{item.studentInfo.grade}</td>
                    <td>{item.performance}</td>
                    <td>{item.score}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }
  }
}

export default Done
