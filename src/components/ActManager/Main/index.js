import React, { Component } from 'react'
import './index.css'
import history from '../../history'
import { Route, Router, Link, Switch } from 'react-router-dom'
import { CreateAct, Enrolling, Manager, Underway, UnRated, Done, ScoreTable, Mine } from '../index'
import { Menu } from 'antd'
import { PlusSquareOutlined, CarryOutOutlined, CalendarOutlined, EditOutlined, UserOutlined, PauseCircleOutlined } from '@ant-design/icons'

class ActManager extends Component {
  state = {
    current: 'all',
  };
  handleClick = e => {
    this.setState({
      current: e.key,
    })
    history.push(`/a/act/${e.key}`)
  }
  render () {
    return (
      <Router history={history}>
        <div className='main-page'>
        <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode='horizontal'>
            <Menu.Item key='new' icon={<PlusSquareOutlined />}>
            <Link to='/a/act/new'>新建活动</Link>
          </Menu.Item>
          <Menu.Item key='enrolling' icon={<CalendarOutlined />}>
            <Link to='/a/act/enrolling'>正在报名</Link>
          </Menu.Item>
            <Menu.Item key='underway' icon={<PauseCircleOutlined />}>
            <Link to='/a/act/underway'>正在进行</Link>
          </Menu.Item>
            <Menu.Item key='unrated' icon={<EditOutlined />}>
            <Link to='/a/act/Unrated'>待打分</Link>
          </Menu.Item>
          <Menu.Item key='done' icon={<CarryOutOutlined />}>
            <Link to='/a/act/done'>已完成</Link>
          </Menu.Item>
            <Menu.Item key='mine' icon={<UserOutlined />}>
              <Link to='/a/act/mine'>我的</Link>
            </Menu.Item>
          </Menu>
        </div>

        <Switch>
          <Route exact path='/a/act/new'>
            <CreateAct />
          </Route>
          <Route path='/a/act/enrolling/manager/:id' component={Manager} />
          <Route path='/a/act/enrolling'>
            <Enrolling />
          </Route>
          <Route path='/a/act/underway/manager/:id' component={Manager} />
          <Route path='/a/act/underway'>
            <Underway />
          </Route>
          <Route path='/a/act/unrated/manager/:id' component={Manager} />
          <Route path='/a/act/Unrated'>
            <UnRated />
          </Route>
          <Route path='/a/act/done/score/:id' component={ScoreTable} />
          <Route path='/a/act/done'>
            <Done />
          </Route>
          <Route path='/a/act/mine'>
            <Mine />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default ActManager
