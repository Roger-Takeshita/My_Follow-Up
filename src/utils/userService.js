import tokenService from './tokenService';

const BASE_URL = '/api/users';

function signup(info) {
    const options = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(info)
    };
    return fetch(`${BASE_URL}/signup`, options)
        .then((res) => {
            if (res.ok) return res.json();
            throw new Error('Bad credentials');
        })
        .then(({ token }) => {
            tokenService.setToken(token);
        });
}

function login(info) {
    const options = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(info)
    };
    return fetch(`${BASE_URL}/login`, options)
        .then((res) => {
            if (res.ok) return res.json();
            throw new Error('Email already taken');
        })
        .then(({ token }) => {
            tokenService.setToken(token);
        });
}

function logout() {
    tokenService.removeToken();
}

function getUser() {
    return tokenService.getUserFromToken();
}

export default {
    signup,
    login,
    logout,
    getUser
};
