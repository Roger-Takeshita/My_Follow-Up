import tokenService from './tokenService';

const SEARCH_URL = '/api/search';

function search(data) {
    const option = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Baerer ' + tokenService.getToken()
        })
    };
    return fetch(`${SEARCH_URL}/${data}`, option).then(async (res) => {
        let data = await res.json();
        if (res.ok) return data;
        throw new Error(data.error);
    });
}

function getData(url, page = 1, numDocs = 100) {
    const option = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Baerer ' + tokenService.getToken()
        })
    };
    return fetch(`${url}/?page=${page}&docs=${numDocs}`, option).then(
        async (res) => {
            let data = await res.json();
            if (res.ok) return data;
            throw new Error(data.error);
        }
    );
}

function postPutData(url, data, id) {
    const option = {
        method: id ? 'PUT' : 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Baerer ' + tokenService.getToken()
        }),
        body: JSON.stringify(data)
    };
    return fetch(id ? `${url}/${id}` : url, option).then(async (res) => {
        let data = await res.json();
        if (res.ok) return data;
        throw new Error(data.error);
    });
}

function deleteData(url, id) {
    const option = {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Baerer ' + tokenService.getToken()
        })
    };
    return fetch(`${url}/${id}`, option).then(async (res) => {
        let data = await res.json();
        if (res.ok) return data;
        throw new Error(data.error);
    });
}

export default {
    search,
    getData,
    postPutData,
    deleteData
};
