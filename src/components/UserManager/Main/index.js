import React, { Component } from 'react'
import { Route, Router, Link, Switch } from 'react-router-dom'
import { AddStudent, Manager, StudentInfo, Mine } from '../index'
import history from '../../history'
import './index.css'

import { Menu } from 'antd'
import { SettingOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'

const { SubMenu } = Menu

class UserManager extends Component {
  state = {
    current: 'all',
  };


  handleClick = e => {
    this.setState({
      current: e.key,
    })
    history.push(`/a/user/${e.key}`)
  }

  render() {
    return (
      <div className='um-main-page'>
        <Router history={history}>
          <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
            <Menu.Item key='all' icon={<UserAddOutlined />}>
              <Link to='/a/user/add'>添加学生</Link>
            </Menu.Item>
            <Menu.Item key='manage' icon={<SettingOutlined />}>
              <Link to='/a/user/manage'>已有学生管理</Link>
            </Menu.Item>
            <Menu.Item key='mine' icon={<UserOutlined />}>
              <Link to='/a/user/mine'>我的</Link>
            </Menu.Item>
          </Menu>

          <Switch>
            <Route exact path='/a/user/all'>
              <AddStudent></AddStudent>
            </Route>
            <Route path='/a/user/manage/:id' component={StudentInfo}></Route>
            <Route path='/a/user/manage'>
              <Manager></Manager>
            </Route>
            <Route path='/a/user/mine'>
              <Mine></Mine>
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default UserManager
