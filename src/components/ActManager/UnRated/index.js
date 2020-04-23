import React, { Component } from 'react'
import history from '../../history'
import axios from 'axios'
import config from '../../config'
import { Activity, RateTable } from '../index'

class UnRated extends Component {
  constructor () {
    super()
    this.state = {
      list: []
    }
    this.getEnroAct = this.getEnroAct.bind(this)
  }

  getEnroAct () {
    axios.get(`${config.baseURL}/activity/unrated`)
      .then(res => {
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
              Component={RateTable}
            />
          </div>
        )
      })
    )
  }
}

export default UnRated
