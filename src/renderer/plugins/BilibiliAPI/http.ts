/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const { getBilibiliHttpProxy } = (window as any).electron

export type ResponseData = {
  code?: number | string
  message?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  [key: string]: any
}
export const liveHttp = axios.create({
  baseURL: getBilibiliHttpProxy() + '/live-api',
  headers: {
    'content-type': 'application/json; charset=utf-8'
  }
})

liveHttp.interceptors.response.use((res) => res.data || {})

export const vtbsHttp = axios.create({
  baseURL: getBilibiliHttpProxy() + '/vtbs-api',
  headers: {
    'content-type': 'application/json; charset=utf-8'
  }
})

vtbsHttp.interceptors.response.use((res) => res.data || {})

// https://api.bilibili.com/x/space/acc/info?mid=14706910&jsonp=jsonp
