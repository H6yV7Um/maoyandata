export const changeTable = (data, bool) => {
  return { type: 'CHANGE_BASIC_PRICING_TABLE', data, bool };
}
export const changeLoading = (bool) => {
  return { type: 'CHANGE_BASIC_PRICING_LOADING', bool };
}

export const showEditModal = (show, data) => {
  return { type: 'SHOW_EDIT_MODAL', show, data };
}



