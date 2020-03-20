import React, { useState } from 'react';
import { connect } from 'react-redux';
import apiService from '../../utils/apiService';
import { addResume } from '../../redux/resume';
import { Prompt } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

function FormResume(props) {
    const initialState = {
        title: '',
        description: '',
        resumeId: '',
        formActive: false
    };

    const [form, setForm] = useState(initialState);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleEditorChange = (content, editor) => {
        setForm({
            ...form,
            description: content,
            modifiedFlag: true
        });
    };

    const handleBtnClick = () => {
        setForm({
            ...form,
            formActive: !form.formActive
        });
    };

    const handleClick = async (title) => {
        const resume = props.resumes.filter((resum) => resum.title === title);

        setForm({
            title: resume[0].title,
            description: resume[0].description,
            resumeId: resume[0]._id,
            formActive: true
        });
    };

    function isFormValid() {
        return !(form.title && form.description);
    }

    function isFormFilled() {
        return !!(form.title || form.description);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = await apiService.newResume(form);
            props.addResume(data);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();
        try {
            const data = await apiService.updateResume(form);
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="container">
            <button onClick={handleBtnClick} hidden={form.formActive}>
                Add New Resume
            </button>
            {form.formActive && (
                <form
                    onSubmit={form.resumeId ? handleUpdate : handleSubmit}
                    className="form-resume"
                >
                    <input
                        className="form-resume__input"
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                    />
                    <Editor
                        apiKey="zkqnr88xpimb3d5neqkp3rtzm2ecyu7s5v7j23ov5102hvbb"
                        value={form.description}
                        init={{
                            height: 500,
                            width: '100%',
                            menubar: true,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar: `undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help`
                        }}
                        onEditorChange={handleEditorChange}
                    />
                    <div className="form-resume__div-button">
                        <Button
                            className="form-resume__button"
                            size="small"
                            variant="contained"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={handleBtnClick}
                        >
                            {' '}
                            Cancel
                        </Button>
                        <button
                            disabled={isFormValid()}
                            className={
                                isFormValid()
                                    ? 'Mui-disabled MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-containedSizeSmall MuiButton-sizeSmall form-resume__button'
                                    : 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-containedSizeSmall MuiButton-sizeSmall form-resume__button'
                            }
                        >
                            Save Resume
                        </button>
                    </div>
                </form>
            )}
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
                                    <a
                                        onClick={() =>
                                            handleClick(resume.title)
                                        }
                                        href="#"
                                    >
                                        {resume.title}
                                        <EditIcon />
                                    </a>
                                    {/* <a onClick={}>
                                        <DeleteForeverIcon />
                                    </a> */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {props.resume ? (
                    <div className="table-message">
                        You don't have any resume
                    </div>
                ) : (
                    ''
                )}
            </TableContainer>
            <Prompt
                when={isFormFilled()}
                message="Are you sure you want to leave? You have unsaved chages"
            />
        </div>
    );
}

const mapStateToProps = (state) => ({
    resumes: state.resumes
});

const mapDispatchToProps = (dispatch) => ({
    addResume: (data) => dispatch(addResume(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormResume);
