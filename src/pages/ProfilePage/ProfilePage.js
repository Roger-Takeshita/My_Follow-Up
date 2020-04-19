import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import UpdateIcon from '@material-ui/icons/Update';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import userService from '../../utils/userService';
import { loginUser } from '../../redux/user';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

function ProfilePage({ user, history, loginUser }) {
    const [form, setForm] = useState({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        newPassword: '',
        confNewPassword: '',
        showPassword: {
            passOne: false,
            passTwo: false,
            passThree: false
        },
        modifiedFlag: false,
        message: ''
    });

    const handleChange = ({ target: { name, value } }) => {
        setForm({
            ...form,
            [name]: value,
            message: ''
        });
    };

    const handleClickShowPassword = (name) => {
        setForm({
            ...form,
            showPassword: { ...form.showPassword, [name]: !form.showPassword[name] }
        });
    };

    function isFormValid() {
        return !(
            form.firstName &&
            form.lastName &&
            form.password &&
            form.newPassword === form.confNewPassword
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.updateUser(form);
            loginUser();
            history.push('/');
        } catch (err) {
            setForm({
                ...form,
                message: err.message
            });
        }
    };

    return (
        <div className="container">
            <h1>
                {form.firstName} {form.lastName}
            </h1>
            <Paper className="profile" elevation={3}>
                <form onSubmit={handleSubmit}>
                    <div className="profile__info">
                        <div className="profile__name-email-pic">
                            <div className="profile__pic">
                                <PersonIcon />
                            </div>
                            <div className="profile__name-email">
                                <TextField
                                    className="profile__input"
                                    label="First Name"
                                    name="firstName"
                                    autoComplete="off"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlineIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    className="profile__input"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="off"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlineIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    className="profile__input"
                                    label="Email"
                                    name="email"
                                    disabled={true}
                                    autoComplete="off"
                                    value={form.email}
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <AlternateEmailIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        <div className="profile__password">
                            <TextField
                                className="profile__input"
                                label="New Password"
                                name="newPassword"
                                type={form.showPassword.passTwo ? 'text' : 'password'}
                                autoComplete="off"
                                value={form.newPassword}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword('passTwo')}
                                            >
                                                {form.showPassword.passTwo ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField
                                className="profile__input"
                                label="Confirm New Password"
                                name="confNewPassword"
                                type={form.showPassword.passThree ? 'text' : 'password'}
                                autoComplete="off"
                                value={form.confNewPassword}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword('passThree')}
                                            >
                                                {form.showPassword.passThree ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <TextField
                                className="profile__input"
                                label="Password"
                                name="password"
                                type={form.showPassword.passOne ? 'text' : 'password'}
                                autoComplete="off"
                                required
                                value={form.password}
                                onChange={handleChange}
                                helperText="* Password is required to update"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => handleClickShowPassword('passOne')}
                                            >
                                                {form.showPassword.passOne ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </div>
                        <div className="profile__ctrl">
                            <Button
                                className="profile__button"
                                size="small"
                                variant="contained"
                                color="secondary"
                                startIcon={<CancelIcon />}
                                onClick={() => history.push('/')}
                            >
                                {' '}
                                Cancel
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<UpdateIcon />}
                                className={isFormValid() ? 'Mui-disabled profile__button' : 'profile__button'}
                            >
                                Update Profile
                            </Button>
                        </div>
                    </div>
                </form>
            </Paper>
            <div className="profile__message" style={{ display: form.message !== '' ? 'flex' : 'none' }}>
                <ReportProblemIcon />
                {form.message}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => ({
    loginUser: () => dispatch(loginUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
