import React, { useReducer } from 'react';
import userService from '../../utils/userService';
import { connect } from 'react-redux';
import { loginUser } from '../../redux/user';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

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
                payload: err.message
            });
        }
    }

    function isFormValid() {
        return !(info.email && info.password);
    }

    const doneMessage = () => {
        setInfo({ ...info, message: '' });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="form-login">
                    <div className="form-login__input">
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
                    <div className="form-login__input">
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
                    <div className="form-login__ctrl">
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isFormValid()}
                        >
                            Log In
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={() => history.push('/signup')}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
                {info.message !== '' ? <ErrorMessage message={info.message} doneMessage={doneMessage} /> : ''}
            </form>
            <div className="form-login__table">
                <table>
                    <tbody>
                        <tr>
                            <th className="form-login__column-one">Email</th>
                            <th className="form-login__column-two">test@test.com</th>
                        </tr>
                        <tr>
                            <td className="form-login__column-one">Password</td>
                            <td className="form-login__column-two">test123</td>
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
