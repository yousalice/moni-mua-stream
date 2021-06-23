export type ConfigOption = {
  match: string
  url: string
}

export const proxyConfig: ConfigOption[] = [
  /**
   * bilibili 直播接口
   */
  {
    match: '/live-api',
    url: 'https://api.live.bilibili.com'
  },
  /**
   * bilibili 空间接口
   */
  {
    match: '/space-api',
    url: 'https://space.bilibili.com'
  },
  /**
   * bilibili api接口
   */
  {
    match: '/api',
    url: 'https://api.bilibili.com'
  },
  /**
   * vtbs api
   */
  {
    match: '/vtbs-api',
    url: 'https://api.vtbs.moe/'
  }
]
