import React from 'react';
import { connect } from 'react-redux';
import FormApplication from '../../components/FormApplication/FormApplication';

function ApplicationPage({ applications, match, history }) {
    const application = applications.find(({ _id }) => _id === match.params.id);

    return <div>{application ? <FormApplication history={history} application={application} id={match.params.id} /> : 'loading...'}</div>;
}

const mapStateToProps = (state) => ({
    applications: state.application
});

export default connect(mapStateToProps)(ApplicationPage);
