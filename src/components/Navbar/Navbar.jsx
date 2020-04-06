import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/user';
import { logoutResume } from '../../redux/resume';
import { toggleDataFlag } from '../../redux/dataFlag';
import HomeIcon from '@material-ui/icons/Home';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DescriptionIcon from '@material-ui/icons/Description';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PersonIcon from '@material-ui/icons/Person';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Search from '../Search/Search';

function Navbar({ history, logoutUser, logoutResume, fullName, toggleDataFlag }) {
    const [sidebar, setSidebar] = useState({
        right: false
    });

    function logoutFn() {
        logoutUser();
        logoutResume();
        toggleDataFlag();
        history.push('/');
    }

    const toggleSidebar = (side, open) => (event) => {
        event.preventDefault();
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setSidebar({ [side]: open });
    };

    const sidebarList = (side) => (
        <div
            className="sidebar-list"
            role="presentation"
            onClick={toggleSidebar(side, false)}
            onKeyDown={toggleSidebar(side, false)}
        >
            <List>
                <ListItem button onClick={() => history.push('/')}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => history.push('/new')}>
                    <ListItemIcon>
                        <AddBoxIcon />
                    </ListItemIcon>
                    <ListItemText primary="New Application" />
                </ListItem>
                <ListItem button onClick={() => history.push('/resumes')}>
                    <ListItemIcon>
                        <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Resumes" />
                </ListItem>
                <ListItem button onClick={() => history.push('/profile')}>
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button onClick={() => logoutFn()}>
                    <ListItemIcon>
                        <MeetingRoomIcon />
                    </ListItemIcon>
                    <ListItemText primary="Log Out" />
                </ListItem>
            </List>
        </div>
    );

    const navbar = fullName ? (
        <div className="navbar__logged-side">
            <Tooltip title="How To Use" TransitionComponent={Zoom} placement="bottom">
                <Link color="inherit" to="/howtouse">
                    How to Use
                </Link>
            </Tooltip>
            <Tooltip title="New Application" TransitionComponent={Zoom} placement="bottom">
                <Link color="inherit" to="/new">
                    <AddCircleOutlineIcon />
                </Link>
            </Tooltip>
            <Tooltip title={`Open Sidebar Menu`} TransitionComponent={Zoom} placement="bottom">
                <Link color="inherit" to="#" onClick={toggleSidebar('right', true)}>
                    {fullName} &nbsp;
                    <MenuIcon />
                </Link>
            </Tooltip>
        </div>
    ) : (
        <div>
            <Tooltip title="How To Use" TransitionComponent={Zoom} placement="bottom">
                <Link color="inherit" to="/howtouse">
                    How to Use
                </Link>
            </Tooltip>
            <Link color="inherit" to="/login">
                Log In
            </Link>
            <Link color="inherit" to="/signup">
                Sign Up
            </Link>
        </div>
    );

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <div className="navbar__home-side">
                        <Tooltip title="Go To Home" TransitionComponent={Zoom} placement="bottom">
                            <Link color="inherit" to="/">
                                <HomeIcon />
                                &nbsp;Home
                            </Link>
                        </Tooltip>
                        <Tooltip title="About Me" TransitionComponent={Zoom} placement="bottom">
                            <Link color="inherit" to="/about">
                                About
                            </Link>
                        </Tooltip>
                    </div>
                    <div className="navbar-search" style={{ display: fullName ? '' : 'none' }}>
                        <Search />
                    </div>
                    {navbar}
                </Toolbar>
            </AppBar>
            <Drawer anchor="right" open={sidebar.right} onClose={toggleSidebar('right', false)}>
                {sidebarList('right')}
            </Drawer>
        </div>
    );
}

const mapStateToProps = (state) => {
    if (state.user) {
        return {
            fullName: `${state.user.firstName} ${state.user.lastName}`
        };
    } else {
        return {
            fullName: null
        };
    }
};

const mapDispatchToProps = (dispatch) => ({
    logoutUser: () => dispatch(logoutUser()),
    logoutResume: () => dispatch(logoutResume()),
    toggleDataFlag: () => dispatch(toggleDataFlag())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
