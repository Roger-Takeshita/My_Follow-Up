const SET_APPLICATIONS = 'SET_APPLICATIONS';
const ADD_APPLICATION = 'ADD_APPLICATION';
const UPDATE_APPLICATION = 'UPDATE_APPLICATION';
const DELETE_APPLICATION = 'DELETE_APPLICATION';
const LOGOUT = 'LOGOUT';
const TOGGLE_STAR = 'TOGGLE_STAR';
const ADD_FOLLOWUP = 'ADD_FOLLOWUP';
const UPDATE_FOLLOWUP = 'UPDATE_FOLLOWUP';
const DELETE_FOLLOWUP = 'DELETE_FOLLOWUP';

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

export const addFollowup = (data) => ({
    type: ADD_FOLLOWUP,
    payload: data
});

export const updateFollowup = (data) => ({
    type: UPDATE_FOLLOWUP,
    payload: data
});

export const deleteFollowup = (data) => ({
    type: DELETE_FOLLOWUP,
    payload: data
});

export const deleteApplication = (id) => ({
    type: DELETE_APPLICATION,
    payload: id
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
                          followup: [...application.followup],
                          coverLetter: action.payload.coverLetter,
                          star: action.payload.star
                      }
                    : application
            );
        case DELETE_APPLICATION:
            const idx = state.findIndex((application) => application._id === action.payload._id);
            return [...state.slice(0, idx), ...state.slice(idx + 1, state.length)];
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
        case ADD_FOLLOWUP:
            const newComment = [
                {
                    _id: action.payload.data._id,
                    description: action.payload.data.description,
                    date: action.payload.data.date
                }
            ];
            return state.map((application) =>
                application._id === action.payload.applicationId
                    ? {
                          ...application,
                          followup: [...application.followup, ...newComment]
                      }
                    : application
            );
        case UPDATE_FOLLOWUP:
            // TODO Update Followup reducer
            return state;
        case DELETE_FOLLOWUP:
            return state.map((application) => {
                return application._id === action.payload.applicationId
                    ? {
                          ...application,
                          followup: [
                              ...application.followup.slice(0, action.payload.idx),
                              ...application.followup.slice(
                                  action.payload.idx + 1,
                                  application.followup.length
                              )
                          ]
                      }
                    : application;
            });
        default:
            return state;
    }
}

export default applicationReducer;
