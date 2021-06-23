import { vtbsHttp } from './http'
import { HttpError } from './httpError'

function httpGet<T, K>(url: string, option: T): Promise<K> {
  return new Promise((resolve, reject) => {
    vtbsHttp.get(url, { params: option })
      .then((res) => {
        if (res) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resolve(res as any)
        } else {
          reject(new HttpError({ code: -1, message: 'empty data' }))
        }
      })
      .catch(e => {
        reject(new HttpError({ code: e.code, message: e.message, config: e }))
      })
  })
}

const get = async function <T, K>(url: string, option?: T): Promise<[error?: HttpError, result?: K]> {
  try {
    const res: K = await httpGet(url, option)
    return [undefined, res]
  } catch (error) {
    return [error]
  }
}

export type ShortVtbOptionItem = {
  mid: number
  uname: string
  roomid: number
}

/**
 * 获取 vtbs.moe 记录的所有主播的简要信息
 */
export const getVtbsShortList = async function (): Promise<[ error?: HttpError, result?: ShortVtbOptionItem[] ]> {
  return await get('/v1/short', {})
}

export type VtbGuardOptionItem = {
  mid: number
  uname: string
  face: string
  level: number
}

/**
 * 获取主播的所有舰长信息
 * @param mid 主播UID
 */
export const getGuardByUser = async function (mid: number): Promise<[ error?: HttpError, result?: VtbGuardOptionItem[] ]> {
  return await get('/v1/guard/' + mid)
}

/**
 * 返回舰长数据更新时间
 */
export const getGuardUpdateTime = async function (): Promise<[ error?: HttpError, result?: number ]> {
  return await get('/v1/guard/time')
}
