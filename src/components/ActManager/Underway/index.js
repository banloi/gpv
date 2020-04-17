import React, { Component } from 'react'
import './index.css'
import axios from 'axios'
import history from '../../history'
import config from '../../config'
import { Activity } from '../index'

class Underway extends Component {
  constructor () {
    super()
    this.state = {
      list: [],
      received: false
    }
    this.getUnderway = this.getUnderway.bind(this)
  }

  getUnderway () {
    axios.get(`${config.baseURL}/activity/underway`)
      .then(res => {
        this.setState({
          list: res.data,
          received: true
        })
        console.log(res)
      }).catch(err => {
        console.log(err.response)
        if (err.response && err.response.data.Error && err.response.data.Error === '请先登录') {
          history.push('/')
        } else (console.log(err))
      })
  }

  /* componentDidMount () {
    this.getUnderway()
  } */

  componentWillMount () {
    this.getUnderway()
  }

  render () {
    const { list, received } = this.state
    if (received && list.length === 0) {
      return (
        <div>
          <h3>暂无正在进行中的活动</h3>
        </div>
      )
    } else {
      return (
        list.map((item) => {
          return (
            <div className='activities' key={item._id}>
              <Activity
                item={item}
              />
            </div>
          )
        })
      )
    }
  }
}

export default Underway
