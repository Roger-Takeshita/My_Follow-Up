import React, { useReducer } from 'react';
import userService from '../../utils/userService';
import { connect } from 'react-redux';
import { signupUser } from '../../redux/user';
import { Prompt } from 'react-router-dom';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';

function formReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_INPUT':
            return {
                ...state,
                [action.payload.name]: action.payload.value,
                message: ''
            };
        case 'ERROR':
            return {
                ...state,
                message: action.payload
            };
        default:
            throw new Error(`Unsupported action type ${action.type}`);
    }
}

function FormSignup({ history, signupUser }) {
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
            signupUser();
            history.push('/');
        } catch (err) {
            console.log(err);
            setInfo({
                type: 'ERROR',
                payload: err.message
            });
        }
    }

    function isFormValid() {
        return !(info.firstName && info.lastName && info.email && info.password === info.confPassword);
    }

    function isFormFilled() {
        return !!(info.firstName || info.lastName || info.email || info.password || info.confPassword);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-signup">
                <div className="form-signup__input">
                    <label>First Name</label>
                    <input
                        name="firstName"
                        placeholder="First Name"
                        value={info.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-signup__input">
                    <label>Last Name</label>
                    <input
                        name="lastName"
                        placeholder="Last Name"
                        value={info.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-signup__input">
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
                <div className="form-signup__input">
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
                <div className="form-signup__input">
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
                <div className="form-signup__ctrl">
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isFormValid()}
                    >
                        Sign Up
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        startIcon={<CancelIcon />}
                        onClick={() => history.push('/login')}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
            <div className="form-signup__message" style={{ display: info.message === '' ? 'none' : 'flex' }}>
                <ReportProblemIcon />
                &nbsp;&nbsp;
                {info.message}
            </div>
            <Prompt when={isFormFilled()} message="Are you sure you want to leave?" />
        </form>
    );
}

const mapDispatchToProps = (dispatch) => ({
    signupUser: () => dispatch(signupUser())
});

export default connect(null, mapDispatchToProps)(FormSignup);
