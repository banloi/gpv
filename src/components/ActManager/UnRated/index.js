import React, { Component } from 'react'
import history from '../../history'
import { config, axios } from '../../config'
import { Activity, RateTable } from '../index'
import { Button } from 'antd'

function ManageNav (props) {
  function handleClick () {
    history.push(`/a/act/unrated/manager/${props.id}`)
    console.log(`${config.url.getUnrated}/${props.id}`)
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

class UnRated extends Component {
  constructor () {
    super()
    this.state = {
      list: []
    }
    this.getEnroAct = this.getEnroAct.bind(this)
  }

  getEnroAct () {
    axios.get(config.url.getUnrated)
      .then(res => {
        console.log(res)
        this.setState({
          list: res.data
        })
      }).catch(err => {
        console.log(err.response)
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
                  item={item}
                  Component={ManageNav}
                />
              </div>
            )
          })
        }
      </div>

    )
  }
}

export default UnRated
