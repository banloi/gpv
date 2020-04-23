import React, { Component } from 'react'
import './index.css'

class Activity extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '', // 活动Id
      state: '报名',
      enrollId: ''
    }
  }

  render () {
    const {
      _id,
      name,
      startTime,
      endTime,
      location,
      limiteOfStu,
      enroNum,
      module,
      detail,
      enroDeadLine
    } = this.props.item
    const { Component } = this.props
    const { id } = this.state
    if (id !== _id) {
      this.setState({
        id: _id
      })
    }
    return (
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
            人数限制: {enroNum} / {limiteOfStu}
        </div>
        <div className='module'>
            模块: {module}
        </div>
        <div>
            报名截止：{enroDeadLine}
        </div>
        <details className='detail'>
          <summary>查看详情</summary>
          <p>{detail}
          </p>
        </details>
        <details className='enrollment'>
          <summary>名单</summary>
          {Component ? <Component activityId={_id} /> : <div>nidaye</div>}
        </details>
        {Component ? <Component activityId={_id} /> : <div>nidaye</div>}
      </div>
    )
  }
}

export default Activity
