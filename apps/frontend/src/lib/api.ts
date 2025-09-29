import axios from 'axios'
import { authStore } from '@/store/auth'

// Prefer proxy to /api; allow override via VITE_API_URL
const baseURL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL,
  withCredentials: true, // send/receive cookies for refresh flow
})

// Attach access token if present
api.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingRequests: Array<(token: string | null) => void> = []

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  pendingRequests.push(cb)
}

function onRefreshed(token: string | null) {
  pendingRequests.forEach((cb) => cb(token))
  pendingRequests = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {}
    if (!response || response.status !== 401 || config?.__isRetry) {
      return Promise.reject(error)
    }

    // Do not try to refresh if the failing request is the refresh endpoint itself
    const reqUrl = (config?.url || '') as string
    if (reqUrl.includes('/auth/refresh')) {
      return Promise.reject(error)
    }

    const store = authStore.getState()

    if (!isRefreshing) {
      isRefreshing = true
      try {
        const { data } = await api.post('/auth/refresh', undefined, { __skipAuthRefresh: true } as any)
        const newToken = data?.access_token as string
        authStore.getState().setAccessToken(newToken)
        onRefreshed(newToken)
        return api({ ...config, __isRetry: true, headers: { ...(config.headers || {}), Authorization: `Bearer ${newToken}` } })
      } catch (e) {
        onRefreshed(null)
        store.clear()
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    // Queue request until token refresh completes
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((token) => {
        if (!token) return reject(error)
        resolve(api({ ...config, __isRetry: true, headers: { ...(config.headers || {}), Authorization: `Bearer ${token}` } }))
      })
    })
  }
)

export default api
