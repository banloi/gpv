import React, { Component } from 'react'
import './index.css'
import axios from 'axios'
import config from '../../config'
import qs from 'qs'

class RateTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      number: '',
      rated: [],
      unRated: [],
      message: '发布后不能再修改，请确认后发布'
    }
    this.OnRate = this.OnRate.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleComplete = this.handleComplete.bind(this)
  }

  componentDidMount () {
    axios.get(`${config.baseURL}/score/ratelist`, {
      params: {
        activityId: this.props.activityId
      }
    })
      .then(res => {
        this.setState({
          rated: res.data.rated,
          unRated: res.data.unRated
        })
      })
      .catch(e => console.log(e))
  }

  // 点击打分
  OnRate (studentNumber, studentId, enroId, performance, score) {
    const { rated, unRated } = this.state
    const activityId = this.props.activityId
    // 选出其它行
    const filter = unRated.filter((item) => {
      return item._id !== enroId
    })
    // 选出操作行
    const ratedOne = unRated.filter((item) => {
      return item._id === enroId
    })
    if (!performance || !score) {
      ratedOne[0].message = '内容不能为空'
      this.setState({
        unRated: [...ratedOne, ...filter]
      })
    } else {
      ratedOne[0].performance = performance
      ratedOne[0].score = score
      ratedOne[0].message = '打分成功'
      axios.post(
        `${config.baseURL}/score`,
        qs.stringify({
          studentNumber: studentNumber,
          studentId: studentId,
          activityId: activityId,
          enroId: enroId,
          performance: performance,
          score: score,
          activityInfo: activityId
        }))
        .then(res => {
          ratedOne[0].message = res.data.message
        })
      this.setState({
        unRated: filter,
        rated: [...ratedOne, ...rated]
      })
    }
  }

  // 发布成绩
  handleComplete () {
    axios.put(
      `${config.baseURL}/activity/complete`,
      qs.stringify({
        activityId: this.props.activityId
      })
    )
      .then(res => {
        this.setState({
          message: res.data.message
        })
      })
  }

  handleSubmit (event) {
    event.preventDefault()
  }

  render () {
    const { unRated, rated } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <h4>开始打分</h4>
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>学号</th>
              <th>评价</th>
              <th>得分</th>
              <th>操作</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {unRated.length !== 0
              ? unRated.map(
                item => {
                  return (
                    <RateLine
                      key={item._id}
                      item={item}
                      OnRate={this.OnRate}
                    />
                  )
                }
              )
              : null}
            {rated.length !== 0
              ? rated.map(
                item => {
                  return (
                    <RatedLine
                      key={item._id}
                      item={item}
                      OnRate={this.OnRate}
                    />
                  )
                }
              )
              : null}
          </tbody>
        </table>
        <button
          onClick={this.handleComplete}
        >发布成绩
        </button>{this.state.message}
      </form>
    )
  }
}

class RateLine extends Component {
  constructor (props) {
    super(props)
    this.state = {
      performance: '',
      score: undefined
    }
    this.handleInput = this.handleInput.bind(this)
  }

  handleInput (event) {
    const name = event.target.name
    this.setState({
      [name]: event.target.value
    })
  }

  render () {
    const { item, OnRate } = this.props
    const { name, number, _id } = item.studentInfo
    const { performance, score } = this.state
    const enroId = item._id
    return (
      <tr>
        <td>{name}</td>
        <td>{number}</td>
        <td>
          <input
            type='text'
            value={performance}
            placeholder='输入评价'
            className='inputEnro'
            name='performance'
            onChange={this.handleInput}
            required
          />
        </td>
        <td>
          <input
            type='number'
            value={score}
            placeholder='输入分数'
            className='inputEnro'
            name='score'
            onChange={this.handleInput}
            required
          />
        </td>
        <td>
          <button
            onClick={() => { OnRate.call(this, number, _id, enroId, performance, score) }}
          >打分
          </button>
        </td>
        <td>
          {item.message
            ? item.message
            : null}
        </td>
      </tr>
    )
  }
}

class RatedLine extends Component {
  constructor (props) {
    super(props)
    this.state = {
      performance: '',
      score: 0
    }
    this.handleInput = this.handleInput.bind(this)
  }

  handleInput (event) {
    const name = event.target.name
    this.setState({
      [name]: event.target.value
    })
  }

  componentDidMount () {
    this.setState({
      performance: this.props.item.performance,
      score: this.props.item.score
    })
  }

  render () {
    const { item } = this.props
    const { performance, score } = this.state
    return (
      <tr>
        <td>{item.studentInfo.name}</td>
        <td>{item.studentInfo.number}</td>
        <td>
          <input
            type='text'
            value={performance}
            placeholder='输入评价'
            className='inputEnro'
            name='performance'
            onChange={this.handleInput}
          />
        </td>
        <td>
          <input
            type='number'
            value={score}
            placeholder='输入分数'
            className='inputEnro'
            name='score'
            onChange={this.handleInput}
          />
        </td>
        <td>
          <button onClick={this.handleAddButton}>修改</button>
        </td>
        <td>{item.message
          ? item.message
          : null}
        </td>
      </tr>
    )
  }
}

export default RateTable
