import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import { connect } from 'react-redux';

function TableResumes(props) {
    function handleClick(title) {}

    return (
        <TableContainer component={Paper}>
            <Table
                className="table-width"
                size="small"
                aria-label="a dense table"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>Resumes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.resumes.map((resume, idx) => (
                        <TableRow key={idx}>
                            <TableCell component="th" scope="row">
                                <a onClick={handleClick(resume.title)} href="#">
                                    {resume.title}
                                    <EditIcon />
                                </a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {props.resume ? (
                <div className="table-message">You don't have any resume</div>
            ) : (
                ''
            )}
        </TableContainer>
    );
}

const mapStateToProps = (state) => ({
    resumes: state.resumes
});

export default connect(mapStateToProps)(TableResumes);
