import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import apiService from '../../utils/apiService';

function SeachPage({ history }) {
    const query = queryString.parse(history.location.search).what;
    const [data, setData] = useState([]);

    useEffect(() => {
        async function searchQuery() {
            const results = await apiService.getData(`/api/applications/search`, {
                search: query
            });
            setData(results);
            console.log(query);
        }
        searchQuery();
    }, [query]);

    const handleClick = async (e, idx) => {
        e.preventDefault();
        // const application = await applications.find(({ _id }) => _id === id);
        console.log(data[idx]);
    };

    return (
        <div>
            <h1>
                {data.length > 0
                    ? data.length > 1
                        ? `Found ${data.length} results for: ${query}`
                        : `Found ${data.length} result for: ${query}`
                    : ` No results for: ${query}`}
            </h1>
            <ul>
                {data.map((application, idx) => {
                    return (
                        <li key={idx}>
                            <a href="/" onClick={(e) => handleClick(e, idx)}>
                                {idx} - {application.title}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default SeachPage;
