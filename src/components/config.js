import axios from 'axios'

const baseUrl = 'http://localhost:3000'

const config = {
  url: {
    userLogin: `${baseUrl}/user/login`,
    admLogin: `${baseUrl}/adm/login`,
    register: `${baseUrl}/user`,
    postEnro: `${baseUrl}/enrollment`,
    cancelEnro: `${baseUrl}/enrollment/cancel`,
    getActivities: `${baseUrl}/activity`,
    getUserEnrolled: `${baseUrl}/user/activities/enrolled`,
    getUserDone: `${baseUrl}/user/activities/done`,
    getUserInfo: `${baseUrl}/user/userinfo`
  }
}

axios.interceptors.request.use(request => {
  try {
    var luffyJwtToken = localStorage.getItem('luffy_jwt_token')
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
    console.log(response)
    if (response.data.token) {
      console.log('token:', response.data.token)
      window.localStorage.setItem('luffy_jwt_token', response.data.token)
    }
    return response
  },
  error => {
    const errRes = error.response
    if (errRes.status === 401) {
      window.localStorage.removeItem('luffy_jwt_token')
      console.log(error.response.data)
      // console.log()('Auth Error!', `${errRes.data.error.message}, please login!`, 'error')
    }
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  })

export { config, axios }
export default config
