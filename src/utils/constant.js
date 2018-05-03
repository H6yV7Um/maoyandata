// 页面权限--页面名称（跟路由的path保持一致）: 权限码
export const pageCodeMap = {
  basicprice: 'ORGANIZATION_CROWD_BASE_PRICE_VIEW',
  pollprice: '',
  gridprice: '',
  grouping: '',
};

// 按钮权限
/*gridprice: { // 页面
    delete: 'ORGANIZATION_CROWD_NOTIFICATION_CENTER_GRID_PRICE_VIEW' // 功能
  }*/

export const btnCodeMap = {
  gridprice: { // 网格改价
    batch: 'ORGANIZATION_CROWD_GRID_PRICE_BATCH_EDIT_TAB', // 批量创建
    stop: 'ORGANIZATION_CROWD_GRID_PRICE_STOP'
  },
  basicprice: { // 基础定价
    city: 'ORGANIZATION_CROWD_BASE_PRICE_CITY', // 城市定价
    batch: 'ORGANIZATION_CROWD_BASE_PRICE_BATCH', // 批量定价
    del: 'ORGANIZATION_CROWD_BASE_PRICE_DELETE', // 删除
  },
  pollprice: { // 轮询加价
    search: 'ORGANIZATION_CROWD_POLLING_PRICE_VIEW', // 查询
    create: 'ORGANIZATION_CROWD_POLLING_PRICE_CREATE', // 创建
    stop: 'ORGANIZATION_CROWD_POLLING_PRICE_STOP', // 停用
  },
  rainprice: { // 雨雪天加价
    'create': 'ORGANIZATION_CROWD_RAIN_SNOW_DAY_PRICE_CREATE' // 创建
  },
  roomrice: { // 特殊餐厅
  },
  creditscore: { // 信用分管理
    view: 'ORGANIZATION_CROWD_NOTIFICATION_CENTER_VIEW' // 删除和下载共用
  },
  grouping: { // 群组管理
    delete: 'ORGANIZATION_GROUPING_DELETE',  // 删除
    create: 'ORGANIZATION_GROUPING_CREATE',  // 创建群组
  },
  grading: {  // 等级配置
    update: 'ORGANIZATION_LEVEL_EDIT',   // 更改配置
  },
  activityconsole: {  // 运营活动
    listAct: 'ORGANIZATION_OPS_ACTIVITY_VIEW_LIST',
    createAct: 'ORGANIZATION_OPS_ACTIVITY_CREATE',
    stopAct: 'ORGANIZATION_OPS_ACTIVITY_ENABLE_DISABLE',
    listTpl: 'ORGANIZATION_CROWD_OPS_ACTIVITY_TEMPLATE',
    createTpl: 'ORGANIZATION_CROWD_OPS_ACTIVITY_TEMPLATE_CREATE',
    modifyTpl: 'ORGANIZATION_CROWD_OPS_ACTIVITY_TEMPLATE_DISABLE_MODIFY'
  },
  activityinvite: {  // 邀请活动
    createAct: 'ORGANIZATION_CROWD_INVITATION_ACTIVITY_CONFIGURATION'
  },
  goodsaudit: { //物资审核
    startCheck: 'ORGANIZATION_CROWD_MATERIALS_AUDIT_AUDIT',
    showDetail: 'ORGANIZATION_CROWD_APPEAL_MGMT_VIEW'
  },
  appealmanager: { //申诉管理
    appealDetail: 'ORGANIZATION_CROWD_APPEAL_MGMT_VIEW',
    appealSuc: 'ORGANIZATION_CROWD_APPEAL_MGMT_EDIT',
    appealFail: 'ORGANIZATION_CROWD_APPEAL_MGMT_EDIT'
  }
};