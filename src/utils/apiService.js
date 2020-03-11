import tokenService from './tokenService';

const BASE_URL = '/api/search';

function search(data) {
    const option = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Baerer ' + tokenService.getToken()
        })
    };
    return fetch(`${BASE_URL}/${data}`, option).then((res) => {
        if (res.ok) return res.json();
        throw new Error("Item doesn't exist");
    });
}

export default {
    search
};
