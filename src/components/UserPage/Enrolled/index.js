import React, { useState, useEffect } from 'react'
import { axios, config } from '../../config'
import Activity from '../Activity'
import history from '../../history'

function Enrolled () {
  const [list, setList] = useState([])

  function getEnrolled () {
    axios.get(config.url.getUserEnrolled)
      .then(
        res => {
          setList(res.data)
          console.log(res.data)
        }
      )
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(getEnrolled, [])

  return (
    <div>
      {
        list.map((item) => {
          return (
            <div className='activities' key={item._id}>
              <Activity
                item={item.activityInfo}
                state='已报名'
                enrollId={item._id}
              />
            </div>)
        })
      }
    </div>
  )
}

export default Enrolled
