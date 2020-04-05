import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../utils/userService';
import { connect } from 'react-redux';
import { loginUser } from '../../redux/user';

function formReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_INPUT':
            return {
                ...state,
                [action.payload.name]: action.payload.value
            };
        case 'ERROR':
            return {
                ...state,
                message: action.payload
            };
        default:
            throw new Error(`Unsuported action ${action.type}`);
    }
}

function FormLogin({ loginUser, history }) {
    const initialState = {
        email: '',
        password: '',
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
            await userService.login(info);
            loginUser();
            history.push('/');
        } catch (err) {
            console.log(err);
            setInfo({
                type: 'ERROR',
                payload: 'Invalid Credentials!'
            });
        }
    }

    function isFormValid() {
        return !(info.email && info.password);
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="form-login">
                    <div className="form-input-login-signup">
                        <label>Email</label>
                        <input name="email" type="email" autoComplete="username" placeholder="Email" value={info.email} onChange={handleChange} />
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
            <div className="login__table">
                <table>
                    <tbody>
                        <tr>
                            <th className="login__column-one">Email</th>
                            <th className="login__column-two">test@test.com</th>
                        </tr>
                        <tr>
                            <td className="login__column-one">Password</td>
                            <td className="login__column-two">test123</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

const mapDispatchToProps = (dispatch) => ({
    loginUser: () => dispatch(loginUser())
});

export default connect(null, mapDispatchToProps)(FormLogin);
