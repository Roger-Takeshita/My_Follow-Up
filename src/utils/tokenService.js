//! Storing, retrieving and removing tokens from localStorage
function setToken(token) {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
}

function updateToken(token) {
    if (token) {
        localStorage.setItem('token', token);
    }
}

//! Getting token and checking if it's still valid
function getToken() {
    let token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        //? atob() - decoding a base-64 encoded string. It is used to decode a string of data which has been encoded using the btoa() method.
        //? JSON.parse - Converting back a json object(
        if (payload.exp < Date.now() / 1000) {
            localStorage.removeItem('token');
            token = null;
        }
    }
    return token;
}

//! Getting user from token
function getUserFromToken() {
    const token = getToken();
    return token ? JSON.parse(atob(token.split('.')[1])).user : null;
}

//! Remove token
function removeToken() {
    localStorage.removeItem('token');
}

export default {
    setToken,
    getToken,
    getUserFromToken,
    removeToken,
    updateToken
};
