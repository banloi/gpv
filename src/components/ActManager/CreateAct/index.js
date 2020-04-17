import React, { Component } from 'react'
import './index.css'
import axios from 'axios'
import history from '../../history'
import config from '../../config'
import qs from 'qs'

class CreateAct extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      location: '',
      limiteOfStu: 0,
      detail: '',
      startTime: '',
      endTime: '',
      enroDeadLine: '',
      constitutor: 'daye',
      module: '',
      message: ''
    }
    this.handleInput = this.handleInput.bind(this)
    this.Submit = this.handleSubmit.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInput (event) {
    const name = event.target.name
    this.setState({
      [name]: event.target.value
    })
  }

  handleFormSubmit (event) {
    event.preventDefault()
  }

  handleSubmit () {
    const { name, location, limiteOfStu, detail, startTime, endTime, enroDeadLine, module } = this.state
    const data = {
      name: name,
      location: location,
      limiteOfStu: limiteOfStu,
      detail: detail,
      startTime: startTime,
      endTime: endTime,
      enroDeadLine: enroDeadLine,
      module: module
    }
    axios.post(`${config.baseURL}/activity`, qs.stringify(data))
      .then(res => {
        if (res.status === 200) {
          console.log(res)
        }
      })
      .catch(
        e => {
          if (e.response.data.Error === '请先登录') {
            history.push('/')
          }
          this.setState({
            message: e.response.data.Error
          })
        }
      ) // 返回 400 时，数据是 err.response
  }

  render () {
    const { number, password, rePassword, telephone, startTime, endTime, enroDeadLine } = this.state
    return (
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <div className='field'>
            <label>名称</label>
            <input
              value={number}
              placeholder='输入活动名称'
              type='text'
              name='name'
              required
              onChange={this.handleInput}
            />
          </div>
          <div className='field'>
            <label>地点</label>
            <input
              value={password}
              placeholder='输入地点'
              type='text'
              name='location'
              required
              onChange={this.handleInput}
            />
          </div>
          <div className='field'>
            <label>人数上限</label>
            <input
              value={rePassword}
              placeholder='输入人数上限'
              type='number'
              name='limiteOfStu'
              required
              onChange={this.handleInput}
            />
          </div>
          <div className='field'>
            <label>报名截止时间</label>
            <input
              value={enroDeadLine}
              placeholder='xxxx-xx-xxTxx:xx'
              type='text'
              name='enroDeadLine'
              required
              onChange={this.handleInput}
            />
          </div>
          <div className='field'>
            <label>开始时间</label>
            <input
              value={startTime}
              placeholder='xxxx-xx-xxTxx:xx'
              type='text'
              name='startTime'
              required
              onChange={this.handleInput}
            />
          </div>
          <div className='field'>
            <label>结束时间</label>
            <input
              value={endTime}
              placeholder='xxxx-xx-xxTxx:xx'
              type='text'
              name='endTime'
              required
              onChange={this.handleInput}
            />
          </div>
          <div className='field'>
            <input type='radio' value='A' name='module' id='A' onChange={this.handleInput} />
            <label>A</label>
            <input type='radio' value='B' name='module' id='B' onChange={this.handleInput} />
            <label>B</label>
            <input type='radio' value='C' name='module' id='C' onChange={this.handleInput} />
            <label>C</label>
            <input type='radio' value='D' name='module' id='D' onChange={this.handleInput} />
            <label>D</label>
          </div>
          <div className='field'>
            <label>详情</label>
            <textarea
              value={telephone}
              type='text'
              name='detail'
              required
              onChange={this.handleInput}
            />
          </div>
          <input type='submit' value='提交' onClick={this.handleSubmit} />
        </form>
      </div>
    )
  }
}

export default CreateAct
