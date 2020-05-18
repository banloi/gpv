import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import qs from 'qs'
import { config, axios } from '../../config'
import history from '../../history'
import './index.css'

function Mine () {
  const [studentInfo, setStudentInfo] = useState([])
  const [score, setScore] = useState([])
  const [telephone, setTelephone] = useState('')
  const [moduleScore, setModuleScore] = useState({})
  useEffect(getInfo, [])
  function getInfo () {
    axios.get(config.url.getUserInfo)
      .then(
        (res) => {
          const data = res.data
          setScore(data.score)
          setStudentInfo(data.info)
          setTelephone(data.telephone)
          // history.push('/u/user/enro')
          console.log(res)
        })
      .catch(err => {
        console.log(err.response)
        if (err.Error === '请先登录') {
          history.push('/')
        }
      })
  }
  function trimScore () {
    moduleScore.A = 0
    moduleScore.B = 0
    moduleScore.C = 0
    moduleScore.D = 0
    moduleScore.all = 0
    score.forEach(item => {
      moduleScore.all += item.score
      moduleScore[item.activityInfo.module] += item.score
      setModuleScore(moduleScore)
    })
  }
  function handleLogout () {
    window.localStorage.removeItem('luffy_jwt_token')
    history.replace('/')
  }
  useEffect(trimScore, [score])
  return (
    <div className='userInfo'>
      <div className='userName'>
        <span className='item'>姓名:</span><span className='info'>{studentInfo.name}</span>
      </div>
      <div className='number'>
        <span className='item'>学号：</span><span className='info'>{studentInfo.number}</span>
      </div>
      <div className='telephone'>
        <span className='item'>手机号：</span><span className='info'>{telephone}</span>
      </div>
      <div>
        <span className='item'>班级：</span><span className='info'>{studentInfo.class}</span>
      </div>
      <div>
        <span className='item'>学院：</span><span className='info'>{studentInfo.school}</span>
      </div>
      <div className='moduleScore'>
        <div className='Module'><span className='item'>总分</span><span className='info'>{moduleScore.all}</span></div>
        <div className='Module'><span className='item'>A模块：</span><span className='info'>{moduleScore.A}</span></div>
        <div className='Module'><span className='item'>B模块：</span><span className='info'>{moduleScore.B}</span></div>
        <div className='Module'><span className='item'>C模块：</span><span className='info'>{moduleScore.C}</span></div>
        <div className='Module'><span className='item'>D模块：</span><span className='info'>{moduleScore.D}</span></div>
      </div>
      <Button onClick={handleLogout}>退出登录</Button>
    </div>
  )
}
export default Mine
