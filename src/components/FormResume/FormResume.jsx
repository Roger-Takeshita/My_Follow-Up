import React, { useState } from 'react';
import { connect } from 'react-redux';
import apiService from '../../utils/apiService';
import { addResume, updateResume, deleteResume } from '../../redux/resume';
import { Prompt, Link } from 'react-router-dom';
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
        formActive: false,
        modifiedFlag: false
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
        if (!form.formActive) {
            setForm({
                ...form,
                formActive: !form.formActive
            });
        } else {
            setForm(initialState);
        }
    };

    const handleClick = async (title) => {
        const resume = props.resumes.filter((resum) => resum.title === title);
        await setForm(initialState);
        await setForm({
            title: resume[0].title,
            description: resume[0].description,
            resumeId: resume[0]._id,
            formActive: true,
            modifiedFlag: false
        });
    };

    function isFormValid() {
        return !(form.title && form.description);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = await apiService.postPutData('/api/resume/new', form);
            props.addResume(data);
            setForm(initialState);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();
        try {
            const data = await apiService.postPutData('/api/resume', form, form.resumeId);
            props.updateResume(data);
            setForm(initialState);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleDelete(id) {
        try {
            const data = await apiService.deleteData('/api/resume', id);
            props.deleteResume(data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="table">
            <button onClick={handleBtnClick} hidden={form.formActive}>
                Add New Resume
            </button>
            {form.formActive && (
                <form onSubmit={form.resumeId ? handleUpdate : handleSubmit} className="form-resume">
                    <input className="form-resume__input" name="title" placeholder="Title" value={form.title} onChange={handleChange} />
                    <Editor
                        apiKey="zkqnr88xpimb3d5neqkp3rtzm2ecyu7s5v7j23ov5102hvbb"
                        value={form.description}
                        init={{
                            height: 500,
                            width: '100%',
                            menubar: true,
                            plugins: `print preview paste importcss searchreplace autolink autosave save directionality code 
                                visualblocks visualchars fullscreen image link media template codesample table charmap hr 
                                pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern 
                                noneditable help charmap emoticons`,

                            toolbar: `fullscreen print | undo redo | bold italic underline strikethrough | 
                            fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | 
                            outdent indent | numlist bullist | forecolor backcolor removeformat | pagebreak emoticons| 
                            image media link anchor | help`
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
                <Table className="table__width" size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Resumes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.resumes.map((resume, idx) => (
                            <TableRow key={idx}>
                                <TableCell component="th" scope="row">
                                    <Link onClick={() => handleClick(resume.title)} to="#">
                                        {resume.title}
                                        <EditIcon />
                                    </Link>
                                    <Link onClick={() => handleDelete(resume._id)} to="#">
                                        <DeleteForeverIcon />
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {props.resume ? <div className="table-message">You don't have any resume</div> : ''}
            </TableContainer>
            <Prompt when={form.modifiedFlag} message="Are you sure you want to leave? You have unsaved chages" />
        </div>
    );
}

const mapStateToProps = (state) => ({
    resumes: state.resume
});

const mapDispatchToProps = (dispatch) => ({
    addResume: (data) => dispatch(addResume(data)),
    updateResume: (data) => dispatch(updateResume(data)),
    deleteResume: (data) => dispatch(deleteResume(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormResume);
