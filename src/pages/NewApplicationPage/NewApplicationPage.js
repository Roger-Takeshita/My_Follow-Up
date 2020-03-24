import React from 'react';
import FormApplication from '../../components/FormApplication/FormApplication';

function NewApplicationPage(props) {
    return (
        <div>
            <FormApplication history={props.history} />
        </div>
    );
}

export default NewApplicationPage;
