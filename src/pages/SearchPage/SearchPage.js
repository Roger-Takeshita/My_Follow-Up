import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import apiService from '../../utils/apiService';

import FormApplication from '../../components/FormApplication/FormApplication';
import TableApplications from '../../components/TableApplications/TableApplications';

function SearchPage({ history }) {
    const query = queryString.parse(history.location.search).what;
    const [results, setResults] = useState([]);
    const [application, setApplication] = useState({});
    const [fetchFlag, setFetchFlag] = useState(false);

    useEffect(() => {
        async function searchQuery() {
            const results = await apiService.getData(`/api/applications/search`, {
                search: query
            });
            setResults(results);
            setApplication({});
            setFetchFlag(true);
        }
        searchQuery();
        return () => {
            setFetchFlag(false);
        };
    }, [query]);

    const handleSelectApplication = async (id) => {
        const findApplication = await results.find(({ _id }) => _id === id);
        if (findApplication) {
            setApplication(findApplication);
        }
    };

    const handleUpdate = (data) => {
        const updateResults = results.map((application) => {
            if (application._id === data._id) application = data;
            return application;
        });
        setResults(updateResults);
    };

    const handleDelete = (id) => {
        const updateResults = results.filter((application) => application._id !== id);
        setResults(updateResults);
    };

    const handleCancel = () => {
        setApplication({});
    };

    const title = application.title ? (
        ''
    ) : results.length > 0 ? (
        results.length > 1 ? (
            <p>
                <span>Found {results.length} Results for: </span>
                <span className="search__query">{query}</span>
            </p>
        ) : (
            <p>
                <span>Found {results.length} Result for: </span>
                <span className="search__query">{query}</span>
            </p>
        )
    ) : (
        <p>
            <span>No Result for: </span>
            <span className="search__query--no-result">{query}</span>
        </p>
    );

    return (
        <div className="container">
            <h1>{fetchFlag ? title : ''}</h1>
            <div>
                {application.title && (
                    <FormApplication
                        history={history}
                        application={application}
                        handleCancel={handleCancel}
                        handleUpdate={handleUpdate}
                    />
                )}
            </div>
            <div hidden={application.title ? true : false}>
                <TableApplications
                    history={history}
                    results={results}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                    handleSelectApplication={handleSelectApplication}
                />
            </div>
        </div>
    );
}

export default SearchPage;
