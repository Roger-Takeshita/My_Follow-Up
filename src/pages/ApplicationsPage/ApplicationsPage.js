import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import FormApplication from '../../components/FormApplication/FormApplication';
import TableApplications from '../../components/TableApplications/TableApplications';

function ApplicationsPage({ applications, history }) {
    const [application, setApplication] = useState({});
    const [applicationsArray, setApplicationsArray] = useState([]);

    useEffect(() => {
        setApplicationsArray(applications);
    }, [applicationsArray, applications]);

    const handleSelectApplication = async (id, idx) => {
        const findApplication = await applications.find(({ _id }) => _id === id);
        if (findApplication) {
            setApplication(findApplication);
        }
    };

    const handleUpdate = (data) => {
        const updateResults = applications.map((application) => {
            if (application._id === data._id) application = data;
            return application;
        });
        setApplicationsArray(updateResults);
    };

    const handleDelete = (id) => {
        const updateResults = applications.filter((application) => application._id !== id);
        setApplicationsArray(updateResults);
    };

    const handleCancel = () => {
        setApplication({});
    };

    return (
        <div className="container">
            <h1>{application.title ? '' : 'Applications'}</h1>
            <div>
                {application.title && (
                    <FormApplication
                        history={history}
                        application={application}
                        handleCancel={handleCancel}
                    />
                )}
            </div>
            <div hidden={application.title ? true : false}>
                <TableApplications
                    history={history}
                    results={applications}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                    handleSelectApplication={handleSelectApplication}
                />
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    applications: state.application
});

export default connect(mapStateToProps)(ApplicationsPage);
