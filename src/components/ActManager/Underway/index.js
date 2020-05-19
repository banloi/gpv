import React, { Component } from 'react'
import './index.css'
import axios from 'axios'
import history from '../../history'
import config from '../../config'
import { Activity, Enrollments } from '../index'
import { Button } from 'antd'

function ManageNav (props) {
  function handleClick () {
    history.push(`/a/act/underway/manager/${props.id}`)
    console.log(`${config.url.enrollingManager}/${props.id}`)
  }
  return (
    <div className='manage-nav'>
      <Button
        onClick={handleClick}
        block
        type='primary'
      >管理
      </Button>
    </div>
  )
}

class Underway extends Component {
  constructor () {
    super()
    this.state = {
      list: []
    }
    this.getEnroAct = this.getEnroAct.bind(this)
  }

  getEnroAct () {
    axios.get(config.url.getUnderway)
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
      <div className='container'>
        {
          list.map((item) => {
            return (
              <div className='activities' key={item._id}>
                <Activity
                  Component={ManageNav}
                  item={item}
                />
              </div>
            )
          })
        }
      </div>
    )
  }
}

class Underways extends Component {
  constructor () {
    super()
    this.state = {
      list: [],
      received: false
    }
    this.getUnderway = this.getUnderway.bind(this)
  }

  getUnderway () {
    axios.get(config.url.getUnderway)
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
                Component={Enrollments}
              />
            </div>
          )
        })
      )
    }
  }
}

export default Underway
