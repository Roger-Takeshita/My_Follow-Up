import React, { useState, useEffect } from 'react';
import apiService from '../../utils/apiService';
import { addResume, updateResume } from '../../redux/resume';
import { connect } from 'react-redux';
// import { Prompt } from 'react-router-dom';

import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { Editor } from '@tinymce/tinymce-react';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import PublishIcon from '@material-ui/icons/Publish';
import UpdateIcon from '@material-ui/icons/Update';

function FormResume({ history, resume, addResume, updateResume, handleDisplayForm }) {
    const initialState = {
        title: '',
        description: '',
        resumeId: '',
        modifiedFlag: false,
        message: ''
    };

    const [form, setForm] = useState(initialState);

    useEffect(() => {
        if (resume._id) {
            setForm({
                title: resume.title,
                description: resume.description,
                resumeId: resume._id,
                modifiedFlag: false,
                message: ''
            });
        }
    }, [resume]);

    const handleChange = ({ target: { name, value } }) => {
        setForm({
            ...form,
            [name]: value,
            modifiedFlag: true
        });
    };

    const handleEditorChange = (content, editor) => {
        setForm({
            ...form,
            description: content,
            modifiedFlag: true
        });
    };

    const handleUpdate = async (e, mode, id) => {
        e.preventDefault();
        try {
            if (mode === 'update') {
                const data = await apiService.putData('/api/resumes', {
                    data: form,
                    parentId: form.resumeId
                });
                updateResume(data);
                history.push('/resumes');
            } else if (mode === 'submit') {
                const data = await apiService.postData('/api/resumes', { data: form });
                addResume(data);
                handleDisplayForm(false);
            }
        } catch (err) {
            console.log(err);
            setForm({
                ...form,
                message: err.message
            });
        }
    };

    const handleCancel = () => {
        form.resumeId !== '' && history.push('/resumes');
        handleDisplayForm(false);
    };

    const doneMessage = () => {
        setForm({ ...form, message: '' });
    };

    function isFormValid() {
        return !(form.title && form.description && form.modifiedFlag);
    }

    return (
        <div className="form-resume">
            {form.resumeId !== '' ? <h1>{form.title}</h1> : <h1>New Resume</h1>}
            <form
                onSubmit={form.resumeId ? (e) => handleUpdate(e, 'update') : (e) => handleUpdate(e, 'submit')}
                className="form-resume__form"
            >
                <div className="form-resume__title">
                    <input
                        className="form-resume__input"
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                    />
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
                <div className="form-resume__ctrl">
                    <Button
                        className="form-resume__button"
                        size="small"
                        variant="contained"
                        color="secondary"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                    >
                        {' '}
                        Cancel
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={form.resumeId !== '' ? <UpdateIcon /> : <PublishIcon />}
                        className={isFormValid() ? 'Mui-disabled form-resume__button' : 'form-resume__button'}
                    >
                        {form.resumeId !== '' ? 'Update Resume' : 'Save Resume'}
                    </Button>
                </div>
            </form>
            {form.message !== '' ? <ErrorMessage message={form.message} doneMessage={doneMessage} /> : ''}
            {/* <Prompt
                when={form.modifiedFlag}
                message="Are you sure you want to leave? You have unsaved chages"
            /> */}
        </div>
    );
}

const mapStateToProps = (state) => ({
    resumes: state.resume
});

const mapDispatchToProps = (dispatch) => ({
    addResume: (data) => dispatch(addResume(data)),
    updateResume: (data) => dispatch(updateResume(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormResume);
