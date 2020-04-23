import React, { Component } from 'react'
import './index.css'
import history from '../../history'
import { Route, Router, Link, Switch } from 'react-router-dom'
import { CreateAct, Enrolling, Underway, UnRated, Done } from '../index'

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
            <Underway />
          </Route>
          <Route path='/a/act/Unrated'>
            <UnRated />
          </Route>
          <Route path='/a/act/complete'>
            <Done />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default ActManager
