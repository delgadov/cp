import axios from 'axios'

const userAuth = 'http://localhost:8080/rest/api/v1/cp/auth/user'
const googleAuth = 'http://localhost:8080/rest/api/v1/cp/auth/google'
const logged = 'http://localhost:8080/rest/api/v1/cp/auth/logged'

export function authenticateUser(auth: any) {
  return axios.post(`${userAuth}`, auth)
}

export function authenticateGoogle(auth: any) {
  return axios.post(`${googleAuth}`, auth)
}

export function isLoggedIn(log: { email: string; sessionToken: string }) {
  return axios.get(`${logged}`, {
    params: {
      email: log.email,
      sessionToken: log.sessionToken
    }
  })
}
