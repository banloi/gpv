import React, { Component } from 'react'
import axios from 'axios'
import './index.css'
import config from '../config'
import qs from 'qs'
import history from '../history'

/* class Activity extends Component {
  constructor (props) {
    super(props)
    this.state = {
      a: 'a'
    }
  }

  render () {
    const { activityList } = this.props
    return (
      <div>{activityList}nidate</div>
    )
  }
} */

class Activity extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '', // 活动Id
      state: '报名',
      enrollId: ''
    }
    this.handleEnroll = this.handleEnroll.bind(this)
  }

  handleEnroll () {
    if (this.state.state === '报名') {
      axios.post(`${config.baseURL}/enrollment`, qs.stringify({
        activityId: this.state.id
      }))
        .then(res => {
          this.setState({
            state: '已报名',
            enrollId: res.enrollId
          })
          console.log(res)
        })
        .catch(err => {
          if (err.response.data.Error === '已报名，无需重复报名') {
            console.log(err.response.data.enrollId)
            this.setState({
              state: '已报名',
              enrollId: err.response.data.enrollId
            })
            console.log(err.response.data)
          }
          console.log(err.message)
        })
    } else if (this.state.state === '已报名') {
      axios.post(`${config.baseURL}/enrollment/cancel`, qs.stringify({
        _id: this.state.enrollId
      }))
        .then(res => {
          console.log(res)
          this.setState({
            state: '报名',
            enrollId: ''
          })
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  }

  render () {
    const { _id, name, startTime, endTime, location, limiteOfStu, module, detail } = this.props.item
    const { id, state } = this.state
    if (id !== _id) {
      this.setState({
        id: _id
      })
    }
    return (
      <div>
        <div className='activity' key={_id}>
          <div className='name'>
            {name}
          </div>
          <div className='time'>
            时间：{startTime} - {endTime}
          </div>
          <div className='location'>
            地点：{location}
          </div>
          <div>
            人数限制:{limiteOfStu}
          </div>
          <div className='module'>
            模块:{module}
          </div>
          <div className='detail'>
            详情:{detail}
          </div>
          <button onClick={this.handleEnroll}>{state}</button>
        </div>
      </div>
    )
  }
}

class Activities extends Component {
  constructor () {
    super()
    this.state = {
      list: []
    }
    this.getAct = this.getAct.bind(this)
  }

  componentDidMount () {
    this.getAct()
  }

  getAct () {
    axios.get(`${config.baseURL}/activity`)
      .then(res => {
        this.setState({
          list: res.data
        })
      })
      .catch(err => {
        console.log(err.response)
        if (err.response.data.Error === '请先登录') {
          history.push('/')
        }
      })
  }

  enroll () {
    console.log('报名')
  }

  render () {
    const { list } = this.state
    console.log(list)
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

export default Activities
