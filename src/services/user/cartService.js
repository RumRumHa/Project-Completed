import { BASE_URL_USER } from '../../api'
import Cookies from 'js-cookie'

const getConfig = () => {
  const token = Cookies.get('token')
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
}

export const cartService = {
  getCart: async () => {
    const response = await BASE_URL_USER.get('/cart/list', getConfig())
    return response.data
  },

  addToCart: async (productId, quantity) => {
    const response = await BASE_URL_USER.post('/cart/add', null, {
      ...getConfig(),
      params: { productId, quantity }
    })
    return response.data
  },

  updateCartItem: async (cartItemId, quantity) => {
    const response = await BASE_URL_USER.put(`/cart/items/${cartItemId}`, { quantity }, getConfig())
    return response.data
  },

  removeFromCart: async (cartItemId) => {
    await BASE_URL_USER.delete(`/cart/items/${cartItemId}`, getConfig())
  },

  clearCart: async () => {
    await BASE_URL_USER.delete('/cart/clear', getConfig())
  },

  checkout: async () => {
    const response = await BASE_URL_USER.post('/cart/checkout', null, getConfig())
    return response.data
  }
} 