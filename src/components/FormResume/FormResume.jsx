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

function FormResume({ resumes, addResume, updateResume, deleteResume }) {
    const initialState = {
        title: '',
        description: '',
        resumeId: '',
        formActive: false,
        modifiedFlag: false
    };

    const [form, setForm] = useState(initialState);

    const handleChange = ({ target: { name, value } }) => {
        setForm({
            ...form,
            [name]: value
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

    const handleClick = async (findTitle) => {
        const resume = resumes.find(({ title }) => title === findTitle);
        await setForm(initialState);
        await setForm({
            title: resume.title,
            description: resume.description,
            resumeId: resume._id,
            formActive: true,
            modifiedFlag: false
        });
    };

    function isFormValid() {
        return !(form.title && form.description);
    }

    const handleUpdate = async (e, mode, id) => {
        e.preventDefault();
        try {
            if (mode === 'update') {
                const data = await apiService.postPutData('/api/resumes', form, form.resumeId);
                updateResume(data);
                setForm(initialState);
            } else if (mode === 'submit') {
                const data = await apiService.postPutData('/api/resumes/new', form);
                addResume(data);
                setForm(initialState);
            } else {
                const data = await apiService.deleteData('/api/resumes', id);
                deleteResume(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {form.resumeId !== '' ? <h1>{form.title}</h1> : <h1>New Resume</h1>}
            <div className="table">
                <button onClick={handleBtnClick} hidden={form.formActive}>
                    Add New Resume
                </button>
                {form.formActive && (
                    <form onSubmit={form.resumeId ? (e) => handleUpdate(e, 'update') : (e) => handleUpdate(e, 'submit')} className="form-resume">
                        <div className="form-resume__title">
                            <input className="form-resume__input" name="title" placeholder="Title" value={form.title} onChange={handleChange} />
                        </div>
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
                            {resumes.map((resume, idx) => (
                                <TableRow key={idx}>
                                    <TableCell component="th" scope="row">
                                        <Link onClick={() => handleClick(resume.title)} to="#">
                                            {resume.title}
                                            <EditIcon />
                                        </Link>
                                        <Link onClick={(e) => handleUpdate(e, 'delete', resume._id)} to="#">
                                            <DeleteForeverIcon />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {resumes ? '' : <div className="table-message">You don't have any resume</div>}
                </TableContainer>
                <Prompt when={form.modifiedFlag} message="Are you sure you want to leave? You have unsaved chages" />
            </div>
        </>
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
