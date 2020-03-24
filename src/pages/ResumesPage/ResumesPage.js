import React from 'react';
import FormResume from '../../components/FormResume/FormResume';

function ResumesPage(props) {
    return (
        <div className="container">
            <h1>ResumesPage</h1>
            <FormResume history={props.history} />
        </div>
    );
}

export default ResumesPage;
