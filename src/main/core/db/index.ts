import level, { LevelDB } from 'level'
import sub from 'subleveldown'
import LRU from 'lru-cache'
import path from 'path'
import { getConfig } from '../appConfig'
import { ensureDirSync } from 'fs-extra'
export * from './FileStream'

const cache = new LRU({ max: 100000, maxAge: 2 * 60 * 60 * 1000 })

export type BatchItemOption = {
  type: 'del' | 'put'
  key: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
}

export function levelDb(name: string): LevelDB {
  const dbPath = path.join(getConfig().db.path, 'db_' + name)
  ensureDirSync(dbPath)
  return level(dbPath, {
    valueEncoding: 'json'
  }, (error) => {
    error && console.log(error)
  }) as unknown as LevelDB
}

export class LevelDataBase {
  name: string
  db: LevelDB
  constructor(name: string, db: LevelDB) {
    this.name = name
    this.db = db
  }

  put(key: string, value: unknown): Promise<void> {
    cache.set(`${this.name}:${key}`, value)
    return new Promise((resolve) => {
      this.db.put(`${this.name}:${key}`, value, () => {
        resolve()
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(key: string): Promise<any> {
    key = `${this.name}:${key}`
    if (cache.has(key)) return Promise.resolve(cache.get(key))
    return new Promise((resolve) => {
      this.db.get(key, (_err, value) => {
        resolve(value)
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async del(key: string): Promise<void> {
    try {
      await this.db.del(`${this.name}:${key}`)
      cache.del(`${this.name}:${key}`)
    } catch {}
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  batch(options: any[]) : Promise<void> {
    options = options.map(({ type, key, value }: BatchItemOption) => {
      return { type, key: `${this.name}:${key}`, value }
    })
    return new Promise((resolve) => {
      this.db.batch(options, () => {
        options.forEach(({ type, key, value }) => {
          type === 'del' ? cache.del(key) : cache.set(key, value)
        })
        resolve()
      })
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SubLevelDataBase<K = any, V = any> {
  db
  name: string
  constructor(name: string, db: LevelDB) {
    this.name = name
    this.db = sub<K, V>(db, name, { valueEncoding: 'json' })
  }

  async put(key: K, value: V): Promise<void> {
    try {
      await this.db.put(key, value)
      cache.set(`${this.name}_${key}`, value)
    } catch {}
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get(key: K): Promise<V | unknown> {
    if (cache.has(`${this.name}_${key}`)) {
      return Promise.resolve(cache.get(`${this.name}_${key}`))
    }
    try {
      return await this.db.get(key)
    } catch {
      return Promise.resolve(null)
    }
  }
}
