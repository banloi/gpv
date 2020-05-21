import React, { Component } from 'react'
import { Card, Collapse } from 'antd'
const { Panel } = Collapse

class Activity extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '', // 活动Id
      state: '',
      enrollId: '',
      score: ''
    }
    this.trim = this.trim.bind(this)
  }

  trim (time) {
    time = time.replace(/T/, ' ')
    time = time.replace(/:00\.000z/gi, '')
    return time
  }

  render () {
    const { _id, name, location, limiteOfStu, enroNum, module, detail, constitutor } = this.props.item
    console.log(enroNum)
    const { Component } = this.props
    if (this.props.enrollId && !this.state.enrollId) {
      this.setState({
        enrollId: this.props.enrollId
      })
      console.log(this.props.enrollId)
    }
    if (this.props.done) {
      console.log(this.props.done)
    }
    let { startTime, endTime, enroDeadLine } = this.props.item
    startTime = this.trim(startTime)
    endTime = this.trim(endTime)
    enroDeadLine = this.trim(enroDeadLine)

    const { id, state } = this.state
    if (id !== _id) {
      this.setState({
        id: _id
      })
    }
    return (
      <div className='activity'>
        <Card title={`[${module}]  ${name}`} extra={<span>{this.props.score ? `得分：${this.props.score}` : ''}</span>}>
          <div className='time'>
            <span className='item'>开始时间：</span><span className='value'>{startTime}</span>
          </div>
          <div className='time'>
            <span className='item'>结束时间：</span><span className='value'>{endTime}</span>
          </div>
          <div className='location'>
            <span className='item'>地点：</span><span className='value'>{location}</span>
          </div>
          <div className='location'>
            <span className='item'>主办方：</span><span className='value'>{constitutor}</span>
          </div>
          {
            this.props.done
              ? null
              : <div>
                <div>
                  <span className='item'>名额: </span><span className='value'>{enroNum} / {limiteOfStu}</span>
                </div>
                <div>
                  <span className='item'>报名截止：</span><span className='value'>{enroDeadLine}</span>
                </div>
                </div>
          }

          <Collapse className='detail'>
            <Panel header='查看详情' key='1'>
              <p>{detail}</p>
            </Panel>
          </Collapse>
        </Card>
        {
          Component
            ? <Component id={id} />
            : null
        }
      </div>
    )
  }
}

export default Activity
