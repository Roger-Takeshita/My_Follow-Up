const SET_APPLICATIONS = 'SET_APPLICATIONS';
const ADD_APPLICATION = 'ADD_APPLICATION';
const UPDATE_APPLICATION = 'UPDATE_APPLICATION';
const DELETE_APPLICATION = 'DELETE_APPLICATION';
const LOGOUT = 'LOGOUT';
const TOGGLE_STAR = 'TOGGLE_STAR';

export const setApplications = (data) => ({
    type: SET_APPLICATIONS,
    payload: data
});

export const addApplication = (data) => ({
    type: ADD_APPLICATION,
    payload: data
});

export const updateApplication = (data) => ({
    type: UPDATE_APPLICATION,
    payload: data
});

export const deleteApplication = (data) => ({
    type: DELETE_APPLICATION,
    payload: data
});

export const logoutApplication = () => ({
    type: LOGOUT
});

export const toggleStar = (data) => ({
    type: TOGGLE_STAR,
    payload: data
});

function applicationReducer(state = [], action) {
    switch (action.type) {
        case SET_APPLICATIONS:
            return [...state, ...action.payload];
        case ADD_APPLICATION:
            return [...state, action.payload];
        case UPDATE_APPLICATION:
            return state.map((application) =>
                application._id === action.payload._id
                    ? {
                          ...application,
                          title: action.payload.title,
                          company: action.payload.company,
                          link: action.payload.link,
                          jobDescription: action.payload.jobDescription,
                          resume: action.payload.resume,
                          appliedOn: action.payload.appliedOn,
                          rejectedOn: action.payload.rejectedOn,
                          status: action.payload.status,
                          followup: [...application.followup, ...action.payload.followup],
                          coverLetter: action.payload.coverLetter,
                          star: action.payload.star
                      }
                    : application
            );
        case DELETE_APPLICATION:
            let index = state.findIndex((item) => item._id === action.payload._id);

            return [...state.slice(0, index), ...state.slice(index + 1, state.length)];
        case LOGOUT:
            return [];
        case TOGGLE_STAR:
            return state.map((application) =>
                application._id === action.payload._id
                    ? {
                          ...application,
                          followup: [...application.followup],
                          star: action.payload.star
                      }
                    : application
            );
        default:
            return state;
    }
}

export default applicationReducer;
