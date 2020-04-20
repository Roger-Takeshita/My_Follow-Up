import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import apiService from '../../utils/apiService';
import { setResults, updateResult, deleteResult, clearResults } from '../../redux/results';

import FormApplication from '../../components/FormApplication/FormApplication';
import TableApplications from '../../components/TableApplications/TableApplications';
import { connect } from 'react-redux';

function SearchPage({ history, results, setResults, updateResult, deleteResult, clearResults }) {
    const query = queryString.parse(history.location.search).what;
    const [application, setApplication] = useState({});
    const [fetchFlag, setFetchFlag] = useState(false);

    useEffect(() => {
        async function searchQuery() {
            const results = await apiService.getData(`/api/applications/search`, {
                search: query
            });
            setResults({ search: query, results });
            setApplication({});
            setFetchFlag(true);
        }
        searchQuery();
        return () => {
            setFetchFlag(false);
        };
    }, [query, setResults]);

    const handleUpdate = (data) => {
        // const updateResults = results.map((application) => {
        //     if (application._id === data._id) application = data;
        //     return application;
        // });
        // setResults(updateResults);
    };

    const handleDelete = (id) => {
        // const updateResults = results.filter((application) => application._id !== id);
        // setResults(updateResults);
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
                        handleUpdate={handleUpdate}
                        fromPage={'search'}
                    />
                )}
            </div>
            <div hidden={application.title ? true : false}>
                <TableApplications
                    history={history}
                    results={results}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                />
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    search: state.results.search,
    results: state.results.results
});

const mapDispatchToProps = (dispatch) => ({
    setResults: (data) => dispatch(setResults(data)),
    updateResult: (data) => dispatch(updateResult(data)),
    deleteResult: (data) => dispatch(deleteResult(data)),
    clearResults: () => dispatch(clearResults())
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
