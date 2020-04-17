import React, { Component } from 'react'
import './index.css'
import axios from 'axios'
import config from '../../config'
import { AddEnro, CancelButton } from '../index'

class Enrollments extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: []
    }
  }

  componentDidMount () {
    axios.get(`${config.baseURL}/enrollment`, {
      params: {
        activityId: this.props.activityId
      }
    })
      .then(res => {
        console.log(res)
        this.setState({
          list: res.data
        })
      })
      .catch(e => console.log(e))
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
          <AddEnro activityId={this.props.activityId} />
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
                <th>操作</th>
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
                    <td><CancelButton enrollId={item._id} activityId={this.props.activityId} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <AddEnro activityId={this.props.activityId} />
        </div>
      )
    }
  }
}

export default Enrollments
