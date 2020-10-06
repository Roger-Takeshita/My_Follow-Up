import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toggleStar, deleteApplication } from '../../redux/application';
import PropTypes from 'prop-types';

import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import StarIcon from '@material-ui/icons/Star';
import apiService from '../../utils/apiService';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

function createData(
    id,
    title,
    company,
    link,
    coverLetter,
    appliedOn,
    rejectedOn,
    followupDate,
    followup,
    star
) {
    return {
        id,
        title,
        company,
        link,
        coverLetter,
        appliedOn,
        rejectedOn,
        followupDate,
        followup,
        star,
    };
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
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
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
    {
        id: 'appliedOn',
        numeric: true,
        disablePadding: false,
        label: 'Applied On',
    },
    {
        id: 'rejectedOn',
        numeric: true,
        disablePadding: false,
        label: 'Rejected On',
    },
    {
        id: 'followup',
        numeric: true,
        disablePadding: false,
        label: 'Follow-up',
    },
    { id: 'star', numeric: true, disablePadding: false, label: 'Star' },
];

function EnhancedTableHead({ classes, order, orderBy, onRequestSort }) {
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
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </span>
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
    rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
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
        width: 1,
    },
}));

function TableApplications({
    history,
    results,
    toggleStar,
    deleteApplication,
    handleDelete,
    handleUpdate,
}) {
    const classes = useStyles();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('appliedOn');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [message, setMessage] = useState('');
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const initialState = results
            ? results.map((application) => {
                  return createData(
                      application._id,
                      application.title,
                      application.company,
                      application.link,
                      application.coverLetter ? 'Yes' : '',
                      application.appliedOn === null
                          ? ''
                          : application.appliedOn.split('T')[0],
                      application.rejectedOn === null
                          ? ''
                          : application.rejectedOn.split('T')[0],
                      application.followup.length > 0
                          ? application.followup[0].date.split('T')[0]
                          : '',
                      application.followup.length > 0
                          ? application.followup[0].description
                          : '',
                      application.star
                  );
              })
            : '';
        setApplications(initialState);
    }, [results]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClick = async (e, mode, id) => {
        e.preventDefault();
        try {
            let data;
            switch (mode) {
                case 'toggleStar':
                    data = await apiService.putData('/api/applications', {
                        data: {},
                        parentId: id,
                    });
                    toggleStar(data);
                    handleUpdate(data);
                    break;
                case 'delete':
                    data = await apiService.deleteData('/api/applications', {
                        parentId: id,
                    });
                    deleteApplication({ _id: data._id });
                    if (results) {
                        handleDelete(data._id);
                    }
                    break;
                default:
                    break;
            }
        } catch (err) {
            setMessage(err.message);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const doneMessage = () => {
        setMessage('');
    };

    const emptyRows =
        rowsPerPage -
        Math.min(rowsPerPage, applications.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={3}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size="small"
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={applications.length}
                        />
                        <TableBody>
                            {stableSort(
                                applications,
                                getComparator(order, orderBy)
                            )
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={index}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                <div className="table-applications__row-job-title">
                                                    <a
                                                        href="/"
                                                        onClick={(e) =>
                                                            handleClick(
                                                                e,
                                                                'delete',
                                                                row.id
                                                            )
                                                        }
                                                    >
                                                        <Tooltip
                                                            title="Delete"
                                                            TransitionComponent={
                                                                Zoom
                                                            }
                                                            placement="left"
                                                            arrow
                                                        >
                                                            <DeleteOutlineIcon />
                                                        </Tooltip>
                                                    </a>
                                                    <Link
                                                        to={`/applications/${row.id}`}
                                                    >
                                                        <Tooltip
                                                            title="Click to Edit"
                                                            TransitionComponent={
                                                                Zoom
                                                            }
                                                            placement="right"
                                                            arrow
                                                        >
                                                            <span>
                                                                {row.title}
                                                            </span>
                                                        </Tooltip>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.company}
                                            </TableCell>
                                            <TableCell align="center">
                                                <a
                                                    href={row.link}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                >
                                                    <Tooltip
                                                        title="Go to Link"
                                                        TransitionComponent={
                                                            Zoom
                                                        }
                                                        placement="right"
                                                        arrow
                                                    >
                                                        <span>Link</span>
                                                    </Tooltip>
                                                </a>
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.coverLetter}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.appliedOn}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.rejectedOn}
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                className="table-applications__followup"
                                            >
                                                <strong>
                                                    {row.followupDate}
                                                </strong>
                                                {row.followupDate ? ` - ` : ''}
                                                {row.followup}
                                            </TableCell>
                                            <TableCell align="center">
                                                <a
                                                    href="/"
                                                    value="teste"
                                                    onClick={(e) =>
                                                        handleClick(
                                                            e,
                                                            'toggleStar',
                                                            row.id
                                                        )
                                                    }
                                                    className={
                                                        row.star
                                                            ? 'table-applications__star--true'
                                                            : 'table-applications__star--false'
                                                    }
                                                >
                                                    <Tooltip
                                                        title={
                                                            row.star
                                                                ? 'Remove from Favorite'
                                                                : 'Add to Favorite'
                                                        }
                                                        TransitionComponent={
                                                            Zoom
                                                        }
                                                        placement="right"
                                                        arrow
                                                    >
                                                        <StarIcon />
                                                    </Tooltip>
                                                </a>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 33 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[15, 50, 100]}
                    component="div"
                    count={applications.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            {message !== '' ? (
                <ErrorMessage message={message} doneMessage={doneMessage} />
            ) : (
                ''
            )}
        </div>
    );
}

const mapStateToProps = (state) => ({
    applicationsArray: state.application,
});

const mapDispatchToProps = (dispatch) => ({
    toggleStar: (id) => dispatch(toggleStar(id)),
    deleteApplication: (id) => dispatch(deleteApplication(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableApplications);
