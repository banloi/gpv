import React, { Component } from 'react'
import axios from 'axios'
import history from '../../history'
import config from '../../config'
import { Activity } from '../index'
import { Button } from 'antd'

function ManageNav (props) {
  function handleClick () {
    history.push(`/a/act/done/score/${props.id}`)
  }
  return (
    <div className='manage-nav'>
      <Button
        onClick={handleClick}
        block
        type='primary'
      >查看成绩
      </Button>
    </div>
  )
}

class Done extends Component {
  constructor () {
    super()
    this.state = {
      list: []
    }
    this.getEnroAct = this.getEnroAct.bind(this)
  }

  getEnroAct () {
    axios.get(config.url.getDone)
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

export default Done
