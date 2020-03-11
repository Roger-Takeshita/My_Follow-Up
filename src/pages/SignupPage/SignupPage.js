import React from 'react';
import FormSignup from '../../components/FormSignup/FormSignup';

function SignupPage(props) {
    return (
        <div>
            <h1>SignupPage</h1>
            <FormSignup history={props.history} />
        </div>
    );
}

export default SignupPage;
