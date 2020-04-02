import React from 'react';
import { connect } from 'react-redux';
import FormApplication from '../../components/FormApplication/FormApplication';

function ApplicationPage(props) {
    const application = props.applications.filter((application) => application._id === props.match.params.id)[0];

    return <div>{application ? <FormApplication history={props.history} application={application} id={props.match.params.id} /> : 'loading...'}</div>;
}

const mapStateToProps = (state) => ({
    applications: state.application
});

export default connect(mapStateToProps)(ApplicationPage);
