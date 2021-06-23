/**
 * 一个简单的应用配置
 * 保存应用的基本配置
 */
import { join } from 'path'
import { homedir, tmpdir } from 'os'
import { ensureFileSync, readFileSync, writeFileSync } from 'fs-extra'
import type { BrowserWindowConstructorOptions } from 'electron'

export type AppConfigOption = {
  db: {
    path: string // 数据库存储路径
    encode: string // 数据库数据保存格式
  },
  path: string,
  messagePath: string,
  browser: Record<'admin' | 'stage' | 'setting' | string, BrowserWindowConstructorOptions>
  [key: string]: unknown
}

// pass: vtb_live_show
const dataDir = join(getTmpDir(), 'moni_live_show_5bba4e504323704e')
const configFile = join(dataDir, '.config')

const defaultConfig: AppConfigOption = {
  path: dataDir,
  messagePath: join(dataDir, 'message'),
  db: {
    path: join(dataDir, 'db'),
    encode: 'json'
  }
}

let _config!: AppConfigOption

export function getConfig(): AppConfigOption {
  if (!_config) {
    ensureFileSync(configFile)
    const config = readFileSync(configFile, 'utf-8')
    _config = config ? JSON.parse(config) : defaultConfig
    !config && writeFileSync(configFile, JSON.stringify(_config, null, '  '))
  }
  return _config
}

export function setConfig(key: string, value: unknown): void {
  const config = getConfig()
  config[key] = value
  ensureFileSync(configFile)
  writeFileSync(configFile, JSON.stringify(config, null, '  '))
  _config = config
}

function getTmpDir(): string {
  if (process.env.NODE_ENV === 'development') {
    return join(process.cwd(), '_cache')
  }
  return tmpdir ? tmpdir() : homedir()
}
