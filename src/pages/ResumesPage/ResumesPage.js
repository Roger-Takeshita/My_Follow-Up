import React from 'react';
import FormResume from '../../components/FormResume/FormResume';

function ResumesPage(props) {
    return (
        <div className="container">
            <FormResume history={props.history} />
        </div>
    );
}

export default ResumesPage;
