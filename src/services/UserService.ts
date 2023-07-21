import axios from 'axios'

const baseURL = 'https://cp-service.onrender.com/rest/api/v1/cp'
const pingDatabaseUrl = baseURL + "/pingDatabase"

export function saveUser(user: any) {
  return axios.post(`${baseURL}`, user)
}

export function findUserByEmail(email: string) {
  return axios.get(`${baseURL}`, {
    params: {
      email: email
    }
  })
}

export function pingDatabase() {
  return axios.get(`${pingDatabaseUrl}`)
}

