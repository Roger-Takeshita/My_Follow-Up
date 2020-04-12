import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import apiService from '../../utils/apiService';
import FormApplication from '../../components/FormApplication/FormApplication';

function SearchPage({ history }) {
    const query = queryString.parse(history.location.search).what;
    const [data, setData] = useState([]);
    const [application, setApplication] = useState({});

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
        setApplication(data[idx]);
        // console.log(data[idx]);
        console.log(application);
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
            <div>
                {application.title && (
                    <FormApplication history={history} application={application} id={application._id} />
                )}
            </div>
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

export default SearchPage;
