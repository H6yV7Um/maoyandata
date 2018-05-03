import I from 'immutable';

const initialState = I.fromJS({
    toolbar: {
        loading: false
    },
    editmodal: {
        show: false,
        data: [],
        loading: false,
    },
    table: {
        data: [],
        loading: false,
        total: 0,
        page: 1
    }
});

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE_BASIC_PRICING_TABLE':
            return state.setIn(['toolbar', 'loading'], action.bool)
                .setIn(['table', 'loading'], action.bool)
                .setIn(['table', 'data'], I.fromJS(action.data.grid_weather))
                .setIn(['table', 'total'], action.data.total_count)
                .setIn(['table', 'page'], action.data.page);
        case 'CHANGE_BASIC_PRICING_LOADING':
            return state.setIn(['toolbar', 'loading'], action.bool)
                .setIn(['table', 'loading'], action.bool);
        case 'SHOW_EDIT_MODAL':
            return state
                .setIn(['editmodal', 'data'], action.data)
                .setIn(['editmodal', 'show'], action.show);
        default:
            return state;
    }
}
