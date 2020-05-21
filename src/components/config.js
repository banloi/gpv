import axios from 'axios'
import history from './history'

const baseUrl = 'http://localhost:3000'

const config = {
  url: {
    userLogin: `${baseUrl}/user/login`,
    admLogin: `${baseUrl}/adm/login`,
    register: `${baseUrl}/user`,
    postEnro: `${baseUrl}/enrollment`,
    cancelEnro: `${baseUrl}/enrollment/cancel`,
    getActivities: `${baseUrl}/activity`,
    deleteActivity: `${baseUrl}/activity`,
    getUserEnrolled: `${baseUrl}/user/activities/enrolled`,
    getUserDone: `${baseUrl}/user/activities/done`,
    getUserInfo: `${baseUrl}/user/userinfo`,
    postActivity: `${baseUrl}/activity`,
    getEnrolling: `${baseUrl}/activity/enrolling`,
    getEnrollment: `${baseUrl}/enrollment`,
    enrollingManager: `${baseUrl}/a/act/enrolling/manager`,
    getActivityInfo: `${baseUrl}/activity/info`, // 获取单个活动信息
    putActivityInfo: `${baseUrl}/activity/info`, // 更新活动信息
    postAdmEnro: `${baseUrl}/enrollment/adm`, // 管理员添加报名表
    deleteAdmEnro: `${baseUrl}/enrollment/cancel`, // 删除活动
    getUnderway: `${baseUrl}/activity/underway`, // 正在进行的活动列表
    getUnrated: `${baseUrl}/activity/unrated`,
    putComplete: `${baseUrl}/activity/complete`,
    getDone: `${baseUrl}/activity/Done`, // 获取完成的活动
    getRatelist: `${baseUrl}/score/ratelist`,
    getScore: `${baseUrl}/score/adm`, // 获取成绩
    postScore: `${baseUrl}/score`, // 打分
    putScore: `${baseUrl}/score`, // 修改分数
    postExcel: `${baseUrl}/student/excel`,

    postStudents: `${baseUrl}/student`,
    getStudent: `${baseUrl}/student`,
    putStudent: `${baseUrl}/student`,
    deleteStudent: `${baseUrl}/student`,

    putAdmPassword: `${baseUrl}/adm/password`
  }
}

axios.interceptors.request.use(request => {
  try {
    var luffyJwtToken = window.localStorage.getItem('luffy_jwt_token')
    if (luffyJwtToken) {
      console.log(luffyJwtToken)
    }
  } catch (e) {
    console.log(e)
  }
  if (luffyJwtToken) {
    request.headers.Authorization = luffyJwtToken
  }
  return request
})

// 拦截响应，遇到token不合法则报错
axios.interceptors.response.use(
  response => {
    if (response.data.token) {
      console.log('token:', response.data.token)
      window.localStorage.setItem('luffy_jwt_token', response.data.token)
    }
    return response
  },
  error => {
    const errRes = error.response
    if (errRes.status && errRes.status === 401) {
      window.localStorage.removeItem('luffy_jwt_token')
      history.push('/')
      // console.log()('Auth Error!', `${errRes.data.error.message}, please login!`, 'error')
    }
    console.log(errRes)
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  })

export { config, axios }
export default config
