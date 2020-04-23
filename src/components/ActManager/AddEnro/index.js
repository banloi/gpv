import React, { Component } from 'react'
import './index.css'
import axios from 'axios'
import config from '../../config'
import qs from 'qs'

class AddEnro extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      number: '',
      enro: [],
      message: '添加报名表'
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleAddButton = this.handleAddButton.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSubmitButtom = this.handleSubmitButtom.bind(this)
    this.OnRemoveButtomClick = this.OnRemoveButtomClick.bind(this)
    this.setEnroState = this.setEnroState.bind(this)
  }

  handleInput (event) {
    const name = event.target.name
    this.setState({
      [name]: event.target.value
    })
  }

  handleAddButton () {
    let { name, number, enro } = this.state
    name.replace((/(^\s*)|(\s*$)/g, '')).toUpperCase()
    number.replace((/(^\s*)|(\s*$)/g, '')).toUpperCase()
    number = number.toUpperCase()
    console.log(number)
    const filter = enro.filter(item => {
      return item.number === number && item.message === '报名成功'
    })
    console.log(filter)
    if (name.length === 0 || number.length === 0) {
      this.setState({
        name: '',
        number: '',
        message: '请勿提交空字符'
      })
    } else if (filter.length > 0) {
      this.setState({
        number: '',
        message: '该学号已存在，请检查后提交'
      })
    } else {
      let message
      /* const update = enro
      update.push(data)
      console.log(enro) */
      axios.post(
        `${config.baseURL}/enrollment/adm`,
        qs.stringify({
          number: number,
          name: name,
          activityId: this.props.activityId
        }, { indices: false })
      )
        .then(res => {
          console.log(res)
          message = res.data.message
          this.setEnroState(name, number, message, enro)
        })
        .catch(
          err => {
            console.log(err.response.data.Error)
            message = err.response.data.Error
            this.setEnroState(name, number, message, enro)
          }
        )
    }
  }

  setEnroState (name, number, message, enro) {
    const data = {
      name: name,
      number: number,
      message: message
    }
    this.setState({
      name: '',
      number: '',
      enro: [...enro, data]
    })
  }

  OnRemoveButtomClick (number) {
    const enro = this.state.enro
    const resu = enro.filter(item => item.number !== number)
    this.setState({
      enro: resu
    })
  }
  // 删除报名

  handleSubmit (event) {
    event.preventDefault()
  }

  handleSubmitButtom () {
    const enro = this.state.enro
    axios.post(
      `${config.baseURL}/enrollment/adm`,
      qs.stringify({
        enro: enro,
        activityId: this.props.activityId
      }, { indices: false })
    )
      .then(res => {
        console.log(res)
      })
      .catch(
        err => console.log(err.response.data.Error)
      )
  }

  render () {
    const { name, number, enro } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <h4>添加报名</h4>
        <table>
          <thead>
            <tr>
              <th>姓名</th>
              <th>学号</th>
              <th>操作</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input type='text' value={name} placeholder='输入姓名' className='inputEnro' name='name' onChange={this.handleInput} />
              </td>
              <td>
                <input type='text' value={number} placeholder='输入学号' className='inputEnro' name='number' onChange={this.handleInput} />
              </td>
              <td>
                <button onClick={this.handleAddButton}>添加</button>
              </td>
              <td>-</td>
            </tr>
            {enro.map(
              item => {
                return (
                  <EnroLine
                    key={item.number}
                    item={item}
                    OnRemoveButtomClick={this.OnRemoveButtomClick}
                  />
                )
              }
            )}
          </tbody>
        </table>
      </form>

    )
  }
}

class EnroLine extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { item, OnRemoveButtomClick } = this.props
    return (
      <tr key={item.number}>
        <td>{item.name}</td>
        <td>{item.number}</td>
        <td><button onClick={() => OnRemoveButtomClick(item.number)}>删除</button></td>
        <td>{item.message}</td>
      </tr>
    )
  }
}

export default AddEnro
