// import PropTypes from 'prop-types'
import React, { Component } from 'react'
// import { render } from 'react-dom'
import './index.css'
import {
  Router,
  Switch,
  Route
} from 'react-router-dom'
// import axios from 'axios'
// axios.defaults.withCredentials = true
import { Login, Main, Register } from '../index'
import history from '../history'

class App extends Component {
  render () {
    return (
      <div>
        <Router history={history}>
          <Switch>
            <Route exact path='/'>
              <Login />
            </Route>
            <Route path='/register'>
              <Register />
            </Route>
            <Route path='/u'>
              <Main />
            </Route>
          </Switch>
        </Router>
      </div>

    )
  }
}

export default App
