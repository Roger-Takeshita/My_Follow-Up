import tokenService from './tokenService';

function requestHelper(type, path, data) {
    let option = {
        method: type,
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Baerer ' + tokenService.getToken()
        })
    };
    if (type === 'POST' || type === 'PUT') option.body = JSON.stringify(data);
    return fetch(path, option).then(async (res) => {
        const updateData = await res.json();
        if (res.ok) return updateData;
        throw new Error(updateData.error);
    });
}

function getData(url, data = { page: undefined, results: undefined, search: undefined }) {
    if (data.page === undefined) data.page = 1;
    if (data.results === undefined) data.results = 100;
    const path = `${url}/?page=${data.page}&docs=${data.results}${data.search !== undefined ? `&search=${data.search}` : ''}`;
    return requestHelper('GET', path);
}

function postData(url, data = { data: undefined, parentId: undefined }) {
    const path = `${url}${data.parentId !== undefined ? `/${data.parentId}/new` : '/new'}`;
    return requestHelper('POST', path, data.data);
}

function putData(url, data = { data: undefined, parentId: undefined, childId: undefined }) {
    const path = `${url}/${data.parentId}${data.childId !== undefined ? `/${data.childId}` : ''}`;
    return requestHelper('PUT', path, data.data);
}

function deleteData(url, data = { parentId: undefined, childId: undefined }) {
    const path = `${url}${data.parentId ? `/${data.parentId}` : ''}${data.childId ? `/${data.childId}` : ''}`;
    return requestHelper('DELETE', path);
}

export default {
    getData,
    postData,
    putData,
    deleteData
};
