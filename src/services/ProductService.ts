import axios from 'axios'

const baseURL = 'http://localhost:8080/rest/api/v1/product'
const allProducts = baseURL + '/all'
const allAvailableProducts = baseURL + '/available'

export function saveProduct(product: FormData) {
  return axios.post(baseURL, product)
}

export function getAllProducts() {
  return axios.get(allProducts)
}

export function getAllAvailableProducts() {
  return axios.get(allAvailableProducts)
}

export function moveProductToUser(productId: string, email: string) {
  return axios.post(`${baseURL}/${productId}/move`, null, { params: { email } })
}

export function getUserProducts(email: string) {
  return axios.get(`${baseURL}/${email}`)
}

export function removeProductFromUser(productId: string) {
  return axios.put(`${baseURL}/${productId}/remove`)
}
