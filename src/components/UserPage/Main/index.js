import React, { Component } from 'react'
import { Route, Router, Link, Switch } from 'react-router-dom'
import { Activities, User, Enrolled, Done, Mine } from '../index'
import history from '../../history'
import './index.css'

import { Menu } from 'antd'
import { MailOutlined, CarryOutOutlined, CalendarOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons'

const { SubMenu } = Menu

class Main extends Component {
  state = {
    current: 'all',
  };

  handleClick = e => {
    this.setState({
      current: e.key,
    })
    history.push(`/u/${e.key}`)
  }

  render() {
    return (
      <div className='main-page'>
        <Router history={history}>
          <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
            <Menu.Item key='all' icon={<HomeOutlined />}>
              <Link to='/u/all'>全部</Link>
            </Menu.Item>
            <Menu.Item key='enrolled' icon={<CalendarOutlined />}>
              <Link to='/u/enrolled'>已报名</Link>
            </Menu.Item>
            <Menu.Item key='rated' icon={<CarryOutOutlined />}>
              <Link to='/u/rated'>已打分</Link>
            </Menu.Item>
            <Menu.Item key='mine' icon={<UserOutlined />}>
              <Link to='/u/mine'>我的</Link>
            </Menu.Item>
          </Menu>
          <Switch>
            <Route exact path='/u/all'>
              <Activities></Activities>
            </Route>
            <Route path='/u/enrolled'>
              <Enrolled />
            </Route>
            <Route path='/u/rated'>
              <Done />
            </Route>
            <Route path='/u/mine'>
              <Mine />
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default Main
