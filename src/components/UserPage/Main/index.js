import React, { Component } from 'react'
import { Route, Router, Link, Switch } from 'react-router-dom'
import { Activities, User } from '../index'
import history from '../../history'
import './index.css'

class Main extends Component {
  render () {
    return (
      <Router history={history}>
        <div className='navigation'>
          <ul className='navigation-list'>
            <li className='navigation-list-item'>
              <Link to='/u/activities'>活动</Link>
            </li>
            <li className='navigation-list-item'>
              <Link to='/u/user'>用户</Link>
            </li>
          </ul>
        </div>

        <Switch>
          <Route exact path='/u/activities'>
            <Activities />
          </Route>
          <Route path='/u/user'>
            <User />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default Main
