import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toggleStar } from '../../redux/application';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import StarIcon from '@material-ui/icons/Star';
import apiService from '../../utils/apiService';

function createData(id, title, company, link, coverLetter, appliedOn, rejectedOn, followupDate, followup, star) {
    return { id, title, company, link, coverLetter, appliedOn, rejectedOn, followupDate, followup, star };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'title', numeric: false, disablePadding: true, label: 'Job Title' },
    { id: 'company', numeric: true, disablePadding: false, label: 'Company' },
    { id: 'link', numeric: true, disablePadding: false, label: 'Link' },
    { id: 'coverLetter', numeric: true, disablePadding: false, label: 'CL' },
    { id: 'appliedOn', numeric: true, disablePadding: false, label: 'Applied On' },
    { id: 'rejectedOn', numeric: true, disablePadding: false, label: 'Rejected On' },
    { id: 'followup', numeric: true, disablePadding: false, label: 'Follow-up' },
    { id: 'star', numeric: true, disablePadding: false, label: 'S' }
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'center'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
    }
}));

function TableApplications(props) {
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('appliedOn');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const applications = props.applications.map((application) => {
        return createData(
            application._id,
            application.title,
            application.company,
            application.link,
            application.coverLetter ? 'Yes' : '',
            application.appliedOn === null ? '' : application.appliedOn.split('T')[0],
            application.rejectedOn === null ? '' : application.rejectedOn.split('T')[0],
            application.followup.length > 0 ? application.followup[application.followup.length - 1].date.split('T')[0] : '',
            application.followup.length > 0 ? application.followup[application.followup.length - 1].description : '',
            application.star
        );
    });

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleStarClick = async (id) => {
        const data = await apiService.postPutData('/api/application', {}, id);
        props.toggleStar(data);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, applications.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table className={classes.table} aria-labelledby="tableTitle" size="small" aria-label="enhanced table">
                        <EnhancedTableHead classes={classes} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={applications.length} />
                        <TableBody>
                            {stableSort(applications, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <TableRow hover tabIndex={-1} key={index}>
                                            <TableCell component="th" scope="row">
                                                <Link to={`/application/${row.id}`}>{row.title}</Link>
                                            </TableCell>
                                            <TableCell align="center">{row.company}</TableCell>
                                            <TableCell align="center">
                                                <a href={row.link} onClick={() => window.open(row.link, '_blank')}>
                                                    Link
                                                </a>
                                            </TableCell>
                                            <TableCell align="center">{row.coverLetter}</TableCell>
                                            <TableCell align="center">{row.appliedOn}</TableCell>
                                            <TableCell align="center">{row.rejectedOn}</TableCell>
                                            <TableCell align="left">
                                                <strong>{row.followupDate}</strong>&nbsp;-&nbsp;{row.followup}
                                            </TableCell>
                                            <TableCell align="center">
                                                <a
                                                    href="/"
                                                    onClick={() => handleStarClick(row.id)}
                                                    className={row.star ? 'table-applications__star--true' : 'table-applications__star--false'}
                                                >
                                                    <StarIcon />
                                                </a>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 33 * emptyRows
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[15, 30, 45]}
                    component="div"
                    count={applications.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}

const mapStateToProps = (state) => ({
    applications: state.application
});

const mapDispatchToProps = (dispatch) => ({
    toggleStar: (id) => dispatch(toggleStar(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(TableApplications);
