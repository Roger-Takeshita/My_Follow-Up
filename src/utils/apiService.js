import tokenService from './tokenService';

const SEARCH_URL = '/api/search';
const RESUMES_URL = '/api/resumes';
const RESUME_URL = '/api/resume';
const NEW_RESUME_URL = '/api/resume/new';
const NEW_APPLICATION_URL = '/api/application/new';

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

function getResumes() {
    const option = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Baerer ' + tokenService.getToken()
        })
    };
    return fetch(`${RESUMES_URL}`, option).then(async (res) => {
        let data = await res.json();
        if (res.ok) return data;
        throw new Error(data.error);
    });
}

function getResume(id) {
    const option = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Baerer ' + tokenService.getToken()
        })
    };
    return fetch(`${RESUME_URL}/${id}`, option).then(async (res) => {
        let data = await res.json();
        if (res.ok) return data;
        throw new Error(data.error);
    });
}

function newResume(data) {
    const option = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Baerer ' + tokenService.getToken()
        }),
        body: JSON.stringify(data)
    };
    return fetch(`${NEW_RESUME_URL}`, option).then(async (res) => {
        let data = await res.json();
        if (res.ok) return data;
        throw new Error(data.error);
    });
}

function updateResume(data) {
    const option = {
        method: 'PUT',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Baerer ' + tokenService.getToken()
        }),
        body: JSON.stringify(data)
    };
    return fetch(`${RESUME_URL}/${data.resumeId}`, option).then(async (res) => {
        let data = await res.json();
        if (res.ok) return data;
        throw new Error(data.error);
    });
}

function deleteResume(id) {
    const option = {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Baerer ' + tokenService.getToken()
        })
    };
    return fetch(`${RESUME_URL}/${id}`, option).then(async (res) => {
        let data = await res.json();
        if (res.ok) return data;
        throw new Error(data.error);
    });
}

function newApplication(data) {
    const option = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Baerer ' + tokenService.getToken()
        }),
        body: JSON.stringify(data)
    };
    return fetch(`${NEW_APPLICATION_URL}`, option).then(async (res) => {
        let data = await res.json();
        if (res.ok) return data;
        throw new Error(data.error);
    });
}

export default {
    search,
    getResume,
    getResumes,
    newResume,
    updateResume,
    deleteResume,
    newApplication
};
