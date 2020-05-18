import React, { useState, useEffect } from 'react'
import { axios, config } from '../../config'
import Activity from '../Activity'
import history from '../../history'

function Done () {
  const [list, setList] = useState([])

  function getDone () {
    axios.get(config.url.getUserDone)
      .then(res => {
        setList(res.data)
      })
      .catch(err => {
        if (err.Error === '请先登录') {
          history.push('/')
        }
      })
  }

  useEffect(getDone, [])

  return (
    <div>
      {
        list.map((item) => {
          return (
            <div className='activities' key={item._id}>
              <Activity
                item={item.activityInfo}
                done
                score={item.score}
              />
            </div>)
        })
      }
    </div>
  )
}

export default Done
