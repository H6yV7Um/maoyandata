import I from 'immutable';

const initialState = I.fromJS({
    toolbar: {
        loading: false
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
        case 'CHANGE_MAOYAN_TABLE':
            return state
            .setIn(['table', 'loading'], action.bool)
            .setIn(['table', 'data'], I.fromJS(action.data))
        case 'CHANGE_POLL_PRICING_LOADING':
            return state.setIn(['toolbar', 'loading'], action.bool)
            .setIn(['table', 'loading'], action.bool);
        default:
            return state;
    }
}
