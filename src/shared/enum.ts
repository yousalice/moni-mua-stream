// 上舰等级
export const enum GuardLevelEnum {
  Normal, // 普通用户
  Captain, // 舰长
  Prefect, // 提督
  Governor // 总督
}

// 粉丝交互类型
export const enum InteractTypeEnum {
  Enter = 1, // 进入
  Follow, // 关注
  Share, // 分享
  Special, // 特关
  MutualFollow // 互关
}

export const enum LiveStatusEnum {
  Closed,
  Open,
  Round
}
