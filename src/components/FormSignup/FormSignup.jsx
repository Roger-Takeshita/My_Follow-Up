import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../utils/userService';
import { connect } from 'react-redux';
import { signupUser } from '../../redux/user';
import { Prompt } from 'react-router-dom';

function formReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_INPUT':
            return {
                ...state,
                [action.payload.name]: action.payload.value
            };
        default:
            throw new Error(`Unsupported action type ${action.type}`);
    }
}

function FormSignup(props) {
    const initialState = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confPassword: '',
        message: ''
    };

    const [info, setInfo] = useReducer(formReducer, initialState);
    function handleChange(e) {
        setInfo({
            type: 'UPDATE_INPUT',
            payload: e.target
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await userService.signup(info);
            props.signupUser();
            props.history.push('/');
        } catch (err) {
            console.log(err);
            setInfo({
                ...info,
                message: 'Invalid Credentials!'
            });
        }
    }

    function isFormValid() {
        return !(
            info.firstName &&
            info.lastName &&
            info.email &&
            info.password === info.confPassword
        );
    }

    function isFormFilled() {
        return !!(
            info.firstName ||
            info.lastName ||
            info.email ||
            info.password ||
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
                        type="email"
                        placeholder="Email"
                        autoComplete="username"
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
                <div className="form-input-login-signup">
                    <label>Confirm Password</label>
                    <input
                        name="confPassword"
                        type="password"
                        autoComplete="new-password"
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
            <div>{info.message}</div>
            <Prompt
                when={isFormFilled()}
                message="Are you sure you want to leave?"
            />
        </form>
    );
}

const mapDispatchToProps = (dispatch) => ({
    signupUser: () => dispatch(signupUser())
});

export default connect(null, mapDispatchToProps)(FormSignup);
