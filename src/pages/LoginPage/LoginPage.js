import React from 'react';
import FormLogin from '../../components/FormLogin/FormLogin';

function LoginPage(props) {
    return (
        <div>
            <h1>LoginPage</h1>
            <FormLogin history={props.history} />
        </div>
    );
}

export default LoginPage;
