import React, { useReducer } from 'react';
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
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/user';
import Icon from '@material-ui/core/Icon';
import apiService from '../../utils/apiService';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import TimelineIcon from '@material-ui/icons/Timeline';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const searchReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_INPUT':
            return {
                [action.payload.name]: action.payload.value
            };
        case 'CLEAR_INPUT':
            return {
                search: ''
            };
        default:
            return state;
    }
};

function Navbar(props) {
    const [state, setState] = React.useState({
        right: false
    });

    const [search, setSearch] = useReducer(searchReducer, { search: '' });

    function handleChange(e) {
        setSearch({
            type: 'UPDATE_INPUT',
            payload: e.target
        });
    }

    async function keyPressed(e) {
        if (e.key === 'Enter') {
            if (search.search !== '') {
                try {
                    const data = await apiService.search(search.search);
                    setSearch({ type: 'CLEAR_INPUT' });
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }

    const toggleDrawer = (side, open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ [side]: open });
    };

    const sideList = (side) => (
        <div
            className="sidebar-list"
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                <ListItem button onClick={() => props.history.push('/new')}>
                    <ListItemIcon>
                        <AddBoxIcon />
                    </ListItemIcon>
                    <ListItemText primary="New Application" />
                </ListItem>
                <ListItem button onClick={() => props.history.push('/summary')}>
                    <ListItemIcon>
                        <TimelineIcon />
                    </ListItemIcon>
                    <ListItemText primary="Summary" />
                </ListItem>
                <ListItem
                    button
                    onClick={() => props.history.push('/contacts')}
                >
                    <ListItemIcon>
                        <ContactMailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Contacts" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button onClick={props.logout}>
                    <ListItemIcon>
                        <MeetingRoomIcon />
                    </ListItemIcon>
                    <ListItemText primary="Log Out" />
                </ListItem>
            </List>
        </div>
    );

    const navNotLoggedin = props.fullName ? (
        <div className="navbar-logged-user">
            <Link className="navbar-link-tag" color="inherit" to="/new">
                <AddCircleOutlineIcon />
            </Link>
            <Link
                className="navbar-link-tag"
                color="inherit"
                to="#"
                onClick={toggleDrawer('right', true)}
            >
                {props.fullName} &nbsp;
                <MenuIcon />
            </Link>
        </div>
    ) : (
        <div>
            <Link className="navbar-link-tag" color="inherit" to="/login">
                Log In
            </Link>
            <Link className="navbar-link-tag" color="inherit" to="/signup">
                Sign Up
            </Link>
        </div>
    );

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Link className="navbar-link-tag" color="inherit" to="/">
                        <Icon>home</Icon>&nbsp;Home
                    </Link>
                    <div
                        className="navbar-search"
                        style={{ display: props.fullName ? '' : 'none' }}
                    >
                        <div className="navbar-search-icon">
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            className="navbar-search-input"
                            name="search"
                            inputProps={{ 'aria-label': 'search' }}
                            value={search.search}
                            onChange={handleChange}
                            onKeyPress={keyPressed}
                        />
                    </div>
                    {navNotLoggedin}
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="right"
                open={state.right}
                onClose={toggleDrawer('right', false)}
            >
                {sideList('right')}
            </Drawer>
        </div>
    );
}

const mapStateToProps = (state) => {
    if (state.userReducer) {
        return {
            fullName: `${state.userReducer.firstName} ${state.userReducer.lastName}`
        };
    } else {
        return {
            fullName: null
        };
    }
};

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logoutUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
