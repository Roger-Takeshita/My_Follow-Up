import React, { useState } from 'react';
import apiService from '../../utils/apiService';
import { deleteResume } from '../../redux/resume';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

function TableSimple({ resumes, deleteResume }) {
    const [message, setMessage] = useState('');

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const data = await apiService.deleteData('/api/resumes', { parentId: id });
            deleteResume(data);
        } catch (err) {
            setMessage(err.message);
        }
    };

    const doneMessage = () => {
        setMessage('');
    };

    return (
        <div>
            <TableContainer component={Paper} elevation={3} className="table-simple">
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Resumes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resumes.map((resume, idx) => (
                            <TableRow key={idx}>
                                <TableCell component="th" scope="row" className="table-simple__table-row">
                                    <Link onClick={(e) => handleDelete(e, resume._id)} to="#">
                                        <Tooltip
                                            title="Delete"
                                            TransitionComponent={Zoom}
                                            placement="left"
                                            arrow
                                        >
                                            <DeleteForeverIcon />
                                        </Tooltip>
                                    </Link>
                                    <Link to={`/resumes/${resume._id}`}>
                                        <Tooltip
                                            title="Click to Edit"
                                            TransitionComponent={Zoom}
                                            placement="right"
                                            arrow
                                        >
                                            <span>{resume.title}</span>
                                        </Tooltip>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {resumes ? '' : <div className="table-simple__message">You don't have any resume</div>}
            {message !== '' ? <ErrorMessage message={message} doneMessage={doneMessage} /> : ''}
        </div>
    );
}

const mapDispatchToProps = (dispatch) => ({
    deleteResume: (data) => dispatch(deleteResume(data))
});

export default connect(null, mapDispatchToProps)(TableSimple);
