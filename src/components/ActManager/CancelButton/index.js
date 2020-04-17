import React, { Component } from 'react'
import './index.css'
import axios from 'axios'
import config from '../../config'
import qs from 'qs'

class CancelButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      state: '删除',
      enrollId: '',
      disabled: false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    axios.post(`${config.baseURL}/enrollment/cancel`, qs.stringify({
      _id: this.props.enrollId,
      activityId: this.props.activityId
    }))
      .then(res => {
        console.log(res)
        this.setState({
          state: '已删除',
          enrollId: '',
          disabled: true
        })
      })
      .catch(err => {
        console.log(err.response)
      })
  }

  render () {
    const { state, disabled } = this.state
    return (
      <button onClick={this.handleClick} disabled={disabled}>{state}</button>
    )
  }
}

export default CancelButton
