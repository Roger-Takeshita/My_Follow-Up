import React from 'react';
import { Link } from 'react-router-dom';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { connect } from 'react-redux';
import tokenService from '../../utils/tokenService';
import { token } from 'morgan';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    },
    list: {
        width: 250
    },
    fullList: {
        width: 'auto'
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto'
        }
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputRoot: {
        color: 'inherit'
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200
        }
    }
}));

function Navbar(props) {
    const classes = useStyles();

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false
    });

    const toggleDrawer = (side, open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const sideList = (side) => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map(
                    (text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    )
                )}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const navNotLoggedin = props.fullName ? (
        <div>
            <Link className="navbar-link-tag" color="inherit" to="/new">
                +
            </Link>
            <Link
                className="navbar-link-tag"
                color="inherit"
                to=""
                onClick={() => tokenService.removeToken()}
            >
                {props.fullName}
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
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        onClick={toggleDrawer('left', true)}
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link className="navbar-link-tag" color="inherit" to="/">
                        Home
                    </Link>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    {navNotLoggedin}
                </Toolbar>
            </AppBar>
            <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
                {sideList('left')}
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

export default connect(mapStateToProps)(Navbar);
