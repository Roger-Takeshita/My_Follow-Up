const SET_RESULTS = 'SET_RESULTS';
const UPDATE_RESULT = 'UPDATE_RESULT';
const DELETE_RESULT = 'DELETE_RESULT';
const CLEAR_RESULTS = 'CLEAR_RESULTS';

export const setResults = (data) => ({
    type: SET_RESULTS,
    payload: data
});

export const updateResult = (data) => ({
    type: UPDATE_RESULT,
    payload: data
});

export const deleteResult = (data) => ({
    type: DELETE_RESULT,
    payload: data
});

export const clearResults = () => ({
    type: CLEAR_RESULTS
});

const initialState = {
    search: '',
    results: []
};

function resultReducer(state = initialState, action) {
    switch (action.type) {
        case SET_RESULTS:
            return Object.assign({}, state, {
                search: action.payload.search,
                results: [...action.payload.results]
            });
        case UPDATE_RESULT:
            return state;
        case DELETE_RESULT:
            return state;
        case CLEAR_RESULTS:
            return Object.assign({}, state, initialState);
        default:
            return state;
    }
}

export default resultReducer;
