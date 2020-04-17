import React, { Component } from 'react'
import './index.css'
import axios from 'axios'
import history from '../../history'
import config from '../../config'
import { Activity } from '../index'

class Enrolling extends Component {
  constructor () {
    super()
    this.state = {
      list: []
    }
    this.getEnroAct = this.getEnroAct.bind(this)
  }

  getEnroAct () {
    axios.get(`${config.baseURL}/activity/enrolling`)
      .then(res => {
        this.setState({
          list: res.data
        })
        console.log(res)
      }).catch(err => {
        console.log(err.response)
        if (err.response && err.response.data.Error && err.response.data.Error === '请先登录') {
          history.push('/')
        } else (console.log(err))
      })
  }

  componentDidMount () {
    this.getEnroAct()
  }

  render () {
    const { list } = this.state
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

export default Enrolling
