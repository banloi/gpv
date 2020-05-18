import React, { Component } from 'react'
import './index.css'
import { config, axios } from '../../config'
import { Tag } from 'antd'
import history from '../../history'
import Activity from '../Activity'

const { CheckableTag } = Tag
const tagsData = ['模块A', '模块B', '模块C', '模块D']

class Activities extends Component {
  constructor () {
    super()
    this.state = {
      list: [],
      enrolled: [],
      selectedTags: [],
      all: true
    }
    this.getAct = this.getAct.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleAll = this.handleAll.bind(this)
  }

  componentDidMount () {
    this.getAct()
  }

  getAct () {
    axios.get(config.url.getActivities)
      .then(res => {
        this.setState({
          list: res.data.all,
          enrolled: res.data.enrolled
        })
      })
      .catch(err => {
        console.log(err)
        if (err.Error === '请先登录') {
          history.push('/')
        }
      })
  }

  enroll () {
    console.log('报名')
  }

  handleSelect (tag, checked) {
    const { selectedTags } = this.state
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag)
    if (nextSelectedTags.length === 0) {
      this.setState({
        selectedTags: nextSelectedTags,
        all: true
      })
    } else {
      this.setState({
        selectedTags: nextSelectedTags,
        all: false
      })
    }
  }

  handleAll () {
    if (!this.state.all) {
      this.setState({
        selectedTags: [],
        all: true
      })
    }
  }

  render () {
    const { list, selectedTags, all } = this.state
    return (
      <div>
        <CheckableTag
          key='all'
          checked={all}
          onChange={this.handleAll}
        >
          全部
        </CheckableTag>
        {tagsData.map(tag => (
          <CheckableTag
            key={tag}
            checked={selectedTags.indexOf(tag) > -1}
            onChange={checked => this.handleSelect(tag, checked)}
          >
            {tag}
          </CheckableTag>
        ))}
        {
          all
            ? list.map((item) => {
              return (
                <div className='activities' key={item._id}>
                  <Activity
                    item={item}
                    state='报名'
                  />
                </div>
              )
            })
            : list.filter(item => {
              return selectedTags.indexOf(`模块${item.module}`) !== -1
            }).map((item) => {
              return (
                <div className='activities' key={item._id}>
                  <Activity
                    item={item}
                    state='报名'
                  />
                </div>
              )
            })
        }
      </div>

    )
  }
}

export default Activities
