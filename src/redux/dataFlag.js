const FLAG_DATA = 'FLAG_DATA';

export const toggleDataFlag = () => ({
    type: FLAG_DATA
});

function toggleDataFagReducer(state = false, action) {
    switch (action.type) {
        case FLAG_DATA:
            return !state;
        default:
            return state;
    }
}

export default toggleDataFagReducer;
