const GET_RESUMES = 'GET_RESUMES';
const ADD_RESUME = 'ADD_RESUME';
const UPDATE_RESUME = 'UPDATE_RESUME';
const DELETE_RESUME = 'DELETE_RESUME';
const LOGOUT_RESUME = 'LOGOUT_RESUME';

export const getResumes = (data) => ({
    type: GET_RESUMES,
    payload: data
});

export const addResume = (data) => ({
    type: ADD_RESUME,
    payload: data
});

export const updateResume = (data) => ({
    type: UPDATE_RESUME,
    payload: data
});

export const deleteResume = (data) => ({
    type: DELETE_RESUME,
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
        case UPDATE_RESUME:
            return state.map((resume) =>
                resume._id === action.payload._id
                    ? {
                          ...resume,
                          title: action.payload.title,
                          description: action.payload.description
                      }
                    : resume
            );
        case DELETE_RESUME:
            let index = state.findIndex(
                (item) => item._id === action.payload._id
            );

            return [
                ...state.slice(0, index),
                ...state.slice(index + 1, state.length)
            ];
        case LOGOUT_RESUME:
            return [];
        default:
            return state;
    }
}

export default resumeReducer;
