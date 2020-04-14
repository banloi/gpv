import React, { Component } from 'react'
import './index.css'
import axios from 'axios'
import history from '../history'
import { Route, Router, Link, Switch } from 'react-router-dom'
import config from '../config'
import qs from 'qs'

class ActManager extends Component {
  render () {
    return (
      <Router history={history}>
        <div className='navigation'>
          <ul className='navigation-list'>
            <li className='navigation-list-item'>
              <Link to='/a/act/new'>新建活动</Link>
            </li>
            <li className='navigation-list-item'>
              <Link to='/a/act/enrolling'>正在报名</Link>
            </li>
            <li className='navigation-list-item'>
              <Link to='/a/act/underway'>正在进行</Link>
            </li>
            <li className='navigation-list-item'>
              <Link to='/a/act/Unrated'>待打分</Link>
            </li>
            <li className='navigation-list-item'>
              <Link to='/a/act/complete'>已完成</Link>
            </li>
          </ul>
        </div>

        <Switch>
          <Route exact path='/a/act/new'>
            <CreateAct />
          </Route>
          <Route path='/a/act/enrolling'>
            <Enrolling />
          </Route>
          <Route path='/a/act/underway'>
            <div>正在进行</div>
          </Route>
          <Route path='/a/act/Unrated'>
            <div>待打分</div>
          </Route>
          <Route path='/a/act/complete'>
            <div>已完成</div>
          </Route>
        </Switch>
      </Router>
    )
  }
}

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
      activityId: this.state.id
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
    const { _id, name, startTime, endTime, location, limiteOfStu, enroNum, module, detail, enroDeadLine } = this.props.item
    const { id } = this.state
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
            <Enrollments activityId={_id} />
          </details>
        </div>
      </div>
    )
  }
}

class Enrollments extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: []
    }
  }

  componentDidMount () {
    axios.get(`${config.baseURL}/enrollment`, {
      params: {
        activityId: this.props.activityId
      }
    })
      .then(res => {
        console.log(res)
        this.setState({
          list: res.data
        })
      })
      .catch(e => console.log(e))
  }

  render () {
    const { list } = this.state
    if (list.length === 0) {
      return (
        <div>
          暂无
        </div>
      )
    } else {
      console.log(list)
      console.log(list instanceof Array)
      return (
        <div>
          <table>
            <thead>
              <tr>
                <th>姓名</th>
                <th>学号</th>
                <th>班级</th>
                <th>学院</th>
                <th>年级</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => {
                return (
                  <tr key={item._id}>
                    <td>{item.studentInfo.name}</td>
                    <td>{item.studentInfo.number}</td>
                    <td>{item.studentInfo.class}</td>
                    <td>{item.studentInfo.school}</td>
                    <td>{item.studentInfo.grade}</td>
                    <td><CancelButton enrollId={item._id} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }
  }
}

export default ActManager
