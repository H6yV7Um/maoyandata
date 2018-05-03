// 公共接口
// elezhongbao/audit/common/getcitylist

const isLocal = !!window.location.port;

export const cityListUri =  isLocal ? '//minos-web.alta.elenet.me/talaris-kerrigan/order/city_list' 
: '//minos-web.ele.me/talaris-kerrigan/order/city_list';


export const permissionUri = isLocal ? '//minos-web.alta.elenet.me/minos-webapi/current_user_permissions' 
: '//minos-web.ele.me/minos-webapi/current_user_permissions';