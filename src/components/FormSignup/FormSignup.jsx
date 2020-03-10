import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function FormSignup(props) {
    const [message, setMessage] = useState('');
    const [info, setInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confPassword: ''
    });

    function handleChange(e) {
        setInfo({
            ...info,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            //api call
        } catch (err) {
            console.log(err);
            setMessage('Invalid Credentials!');
        }
    }

    function isFormValid() {
        return !(
            info.firstName &&
            info.lastName &&
            info.email &&
            info.password &&
            info.confPassword
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-signup">
                <div className="form-input-login-signup">
                    <label>First Name</label>
                    <input
                        name="firstName"
                        placeholder="First Name"
                        value={info.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-input-login-signup">
                    <label>Last Name</label>
                    <input
                        name="lastName"
                        placeholder="Last Name"
                        value={info.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-input-login-signup">
                    <label>Email</label>
                    <input
                        name="email"
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
                        placeholder="Password"
                        value={info.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-input-login-signup">
                    <label>Confirm Password</label>
                    <input
                        name="confPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={info.confPassword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <button disabled={isFormValid()}>Sign Up</button>
                    &nbsp;&nbsp;&nbsp;
                    <Link to="/login">Cancel</Link>
                </div>
            </div>
        </form>
    );
}

export default FormSignup;
