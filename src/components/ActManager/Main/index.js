import React, { Component } from 'react'
import './index.css'
import history from '../../history'
import { Route, Router, Link, Switch } from 'react-router-dom'
import { CreateAct, Enrolling, Manager, Underway, UnRated, Done, ScoreTable } from '../index'

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
              <Link to='/a/act/done'>已完成</Link>
            </li>
          </ul>
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
        </Switch>
      </Router>
    )
  }
}

export default ActManager
