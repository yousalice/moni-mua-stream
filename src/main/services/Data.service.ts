/**
 * 数据库服务
 * 实例 db 是 主数据库，在基于这个数据库的基础上，创建带命名空间的别名数据库
 * 命名空间的数据库主要用于存储简要数据，以便于搜索
 * 在这个基础上，新建 子数据库，用于保存各类详细数据
 */
import { Service } from './Service'
import { LevelDataBase, SubLevelDataBase, levelDb } from '../core/db'
import { LevelDB } from 'level'

export class DataBaseService extends Service {
  db!: LevelDB // 主数据库
  basic!: LevelDataBase // 公共数据
  common!: LevelDataBase

  bootstrap(): void {
    const db = this.db = levelDb('app')

    this.basic = new LevelDataBase('basic', db)
    this.common = new LevelDataBase('common', db)
  }

  async setCurrentVtuber(uid: number): Promise<void> {
    await this.common.put('current_vtuber', uid)
  }

  async getCurrentVtuber(): Promise<number> {
    return await this.common.get('current_vtuber')
  }

  setBasic(name: string): void {
    this.basic = new LevelDataBase(name, this.db)
  }

  async setCurrentReward(id: number): Promise<void> {
    await this.basic.put('current_reward', id)
  }

  async getCurrentReward(): Promise<number> {
    return await this.basic.get('current_reward')
  }

  // 奖品配置
  async setRewardConfig<T>(configList: T): Promise<void> {
    await this.basic.put('reward_config_list', configList)
  }

  // 奖品配置
  async getRewardConfig<T>(): Promise<T> {
    return await this.basic.get('reward_config_list')
  }

  // 获奖统计
  async setAwardList<T>(awardList: T): Promise<void> {
    await this.basic.put('award_list', awardList)
  }

  // 获奖统计
  async getAwardList<T>(): Promise<T> {
    return await this.basic.get('award_list')
  }

  async setBlackList<T>(blackList: T): Promise<void> {
    await this.basic.put('black_List', blackList)
  }

  async getBlackList<T>(): Promise<T> {
    return await this.basic.get('black_List')
  }

  async setRankList<T>(rankList: T): Promise<void> {
    await this.basic.put('rank_list', rankList)
  }

  async getRankList<T>(): Promise<T> {
    return await this.basic.get('rank_list')
  }

  async setWeightList<T>(weightList: T): Promise<void> {
    await this.basic.put('weight_list', weightList)
  }

  async getWeightList<T>(): Promise<T> {
    return await this.basic.get('weight_list')
  }
}
