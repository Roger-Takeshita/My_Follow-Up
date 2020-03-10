import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FormLogin(props) {
    const [info, setInfo] = useState({
        email: '',
        password: '',
        message: ''
    });

    function handleChange(e) {
        setInfo({
            ...info,
            message: '',
            [e.target.name]: e.target.value
        });
        console.log(info);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            //api call
        } catch (err) {
            console.log(err);
            setInfo({ ...info, message: 'Invalid Credentials!' });
        }
    }

    function isFormValid() {
        return !(info.email && info.password);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-login">
                <div className="form-input-login-signup">
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        autoComplete="username"
                        placeholder="Email"
                        value={info.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-input-login-signup">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Password"
                        value={info.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <button disabled={isFormValid()}>Log In</button>
                    &nbsp;&nbsp;&nbsp;
                    <Link to="/signup">Cancel</Link>
                </div>
            </div>
            <div>{info.message}</div>
        </form>
    );
}

export default FormLogin;
