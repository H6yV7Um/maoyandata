export const changeTable = (data,bool) => {
  return {type: 'CHANGE_MAOYAN_TABLE', data, bool};
}
export const changeLoading = (bool) => {
  return {type: 'CHANGE_POLL_PRICING_LOADING', bool};
}