import React, { Component } from 'react'
import './index.css'
import axios from 'axios'
// import history from '../history'
// import { Route, Router, Link, Switch } from 'react-router-dom'
import config from '../../config'
import qs from 'qs'

class User extends Component {
  constructor () {
    super()
    this.state = {
      list: {},
      showEnro: true
    }

    this.getUserInfo = this.getUserInfo.bind(this)
    this.handleBtnClick = this.handleBtnClick.bind(this)
  }

  getUserInfo () {
    axios.get('http://localhost:3000/user/activities')
      .then(
        (res) => {
          this.setState({
            list: res.data
          })
          // history.push('/u/user/enro')
          console.log(res)
        })
      .catch(err => {
        this.setState = {
          list: {}
        }
        console.log(err.response)
        /* if (err.response.data.Error === '请先登录') {
          console.log('nidaye')
          history.push('/')
        } */
      })
  }

  componentDidMount () {
    this.getUserInfo()
  }

  handleBtnClick (event) {
    const name = event.target.name
    if (name === 'enrollment') {
      this.setState({
        showEnro: true
      })
    } else if (name === 'score') {
      this.setState({
        showEnro: false
      })
    }
  }

  /*   handleInput (event) {
    const name = event.target.name
    this.setState({
      [name]: event.target.value
    })
  }
 */
  render () {
    const { studentInfo, enro, score, telephone } = this.state.list
    const { showEnro } = this.state
    const moduleScore = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      all: 0
    }
    if (studentInfo) {
      console.log('ojbk')
      score.forEach(item => {
        const module = item.activityInfo.module
        const score = item.score
        switch (module) {
          case 'A':
            moduleScore.A += score
            moduleScore.all += score
            break
          case 'B':
            moduleScore.B += score
            moduleScore.all += score
            break
          case 'C':
            moduleScore.C += score
            moduleScore.all += score
            break
          case 'D':
            moduleScore.D += score
            moduleScore.all += score
            break
          default: break
        }
      })
      return (
        <div className='user'>
          <div className='userInfo'>
            <div className='userName'>
              姓名: {studentInfo.name}
            </div>
            <div className='number'>
              学号：{studentInfo.number}
            </div>
            <div className='telephone'>
              手机号：{telephone}
              <button>更改手机号</button>
            </div>
            <div>
              班级：{studentInfo.class}
            </div>
            <div>
              学院：{studentInfo.school}
            </div>
            <div className='totalScore'>
              总分:{moduleScore.all}
            </div>
            <div className='moduleScore'>
              <div className='Module'>A模块：{moduleScore.A}</div>
              <div className='Module'>B模块：{moduleScore.B}</div>
              <div className='Module'>C模块：{moduleScore.C}</div>
              <div className='Module'>D模块：{moduleScore.D}</div>
            </div>
          </div>
          <div>
            <button name='enrollment' onClick={this.handleBtnClick}>
              已报名
            </button>
            <button name='score' onClick={this.handleBtnClick}>
              已打分
            </button>
          </div>
          {
            showEnro
              ? enro.map(item => {
                return (
                  <div key={item._id}>
                    <Activity item={item} />
                  </div>
                )
              })
              : showScore(score)
          }
        </div>
      )
    } else {
      return (<div>加载中</div>)
    }
  }
}

class Activity extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '',
      state: '已报名',
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
        _id: this.state.enrollId,
        activityId: this.state.id
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
    const { _id, name, startTime, endTime, location, limiteOfStu, enroNum, module, detail } = this.props.item.activityInfo
    const enrollId = this.props.item._id // 此为报名表 id， 上面的 _id 为活动 id
    const { id, state } = this.state
    if (id !== _id) {
      this.setState({
        id: _id,
        enrollId: enrollId
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
          <details className='detail'>
            <summary>查看详情</summary>
            <p>{detail}
            </p>
          </details>
          <button onClick={this.handleEnroll}>{state}</button>
        </div>
      </div>
    )
  }
}

function showScore (props) {
  const list = props
  console.log(list)
  return (
    <div>
      <div>
        <span>模块</span>
        <span>名称</span>
        <span>时间</span>
        <span>得分</span>
      </div>
      <div>
        {list.map(item => {
          return (
            <div key={item._id}>
              <span>{item.activityInfo.module}</span>
              <span>{item.activityInfo.name}</span>
              <span>{item.activityInfo.startTime.split('T')[0]}-{item.activityInfo.endTime.split('T')[0]}</span>
              <span>{item.score}</span>
            </div>
          )
        })}
      </div>
    </div>

  )
}

export default User
