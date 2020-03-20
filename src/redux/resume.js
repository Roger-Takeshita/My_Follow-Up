const GET_RESUMES = 'GET_RESUMES';
const ADD_RESUME = 'ADD_RESUME';
const LOGOUT_RESUME = 'LOGOUT_RESUME';

export const getResumes = (data) => ({
    type: GET_RESUMES,
    payload: data
});

export const addResume = (data) => ({
    type: ADD_RESUME,
    payload: data
});

export const logoutResume = () => ({
    type: LOGOUT_RESUME
});

function resumeReducer(state = [], action) {
    switch (action.type) {
        case GET_RESUMES:
            return [...state, ...action.payload];
        case ADD_RESUME:
            return [...state, action.payload];
        case LOGOUT_RESUME:
            return [];
        default:
            return state;
    }
}

export default resumeReducer;
