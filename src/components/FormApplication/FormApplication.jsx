import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { connect } from 'react-redux';
import apiService from '../../utils/apiService';
import { addResume, updateResume, deleteResume } from '../../redux/resume';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DoneIcon from '@material-ui/icons/Done';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import BusinessIcon from '@material-ui/icons/Business';
import LinkIcon from '@material-ui/icons/Link';
import DescriptionIcon from '@material-ui/icons/Description';

function FormApplication(props) {
    const initialState = {
        jobTitle: '',
        company: '',
        link: '',
        jobDescription: '',
        resume: '',
        appliedOn: '',
        rejectedOn: '',
        status: '',
        coverLetter: '',
        coverLetterActive: false
    };

    const [form, setForm] = useState(initialState);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleJobEditorChange = (content, editor) => {
        setForm({
            ...form,
            jobDescription: content
        });
    };

    const handleResumeEditorChange = (content, editor) => {
        setForm({
            ...form,
            resume: content
        });
    };

    const handleCoverLetterEditorChange = (content, editor) => {
        setForm({
            ...form,
            coverLetter: content
        });
    };

    const handleCoverLetterVisible = (e) => {
        e.preventDefault();
        setForm({
            ...form,
            coverLetterActive: !form.coverLetterActive
        });
    };

    const handleCancelBtn = () => {
        if (!form.formActive) {
            setForm({
                ...form,
                formActive: !form.formActive
            });
        } else {
            setForm(initialState);
        }
    };

    //= fix this for last
    function isFormValid() {
        return !(form.title && form.description);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = await apiService.newResume(form);
            props.addResume(data);
            setForm(initialState);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="container">
            <h1>
                {form.jobTitle
                    ? form.jobTitle.toUpperCase()
                    : 'New Application'}
                {form.company ? ` - ${form.company}` : ''}
            </h1>
            <form onSubmit={handleSubmit} className="form-application">
                <div className="form-application__header">
                    <TextField
                        className="form-application__title"
                        label="Job Title"
                        color="primary"
                        name="jobTitle"
                        value={form.jobTitle}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <DescriptionIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        className="form-application__company"
                        label="Company"
                        color="primary"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BusinessIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        className="form-application__link"
                        label="Link"
                        color="primary"
                        name="link"
                        value={form.link}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LinkIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    <FormControl className="form-application__status">
                        <InputLabel id="demo-controlled-open-select-label">
                            Status
                        </InputLabel>
                        <Select
                            labelId="demo-controlled-open-select-label"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="applied">Applied</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="form-application__forms">
                    <div className="form-application__form-job">
                        <div className="form-application__form-title">
                            Job Description
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
                            onEditorChange={handleJobEditorChange}
                        />
                    </div>
                    <div className="form-application__form-resume">
                        <div className="form-application__form-title">
                            Resume
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
                            onEditorChange={handleResumeEditorChange}
                        />
                    </div>
                </div>
                <div className="form-application__followup">
                    <div className="form-application__followup-list">
                        <ul>
                            <li>called</li>
                            <li>sent an email</li>
                            <li>applied again for the job</li>
                        </ul>
                    </div>
                    <div className="form-application__followup-list-input">
                        {form.coverLetterActive && (
                            <div className="form-application__form-cl">
                                <div className="form-application__form-title">
                                    Cover Letter
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
                                    onEditorChange={
                                        handleCoverLetterEditorChange
                                    }
                                />
                            </div>
                        )}
                        <div className="form-application__followup-ctrl">
                            <a
                                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedSizeSmall MuiButton-sizeSmall a-add"
                                href="/"
                                onClick={handleCoverLetterVisible}
                            >
                                {form.coverLetterActive ? 'Hide CL' : 'Show CL'}
                            </a>
                            <TextField
                                className="form-application__date"
                                label="Applied On"
                                type="date"
                                name="appliedOn"
                                value={form.appliedOn}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                            <TextField
                                className="form-application__date"
                                label="Rejected On"
                                type="date"
                                name="rejectedOn"
                                value={form.rejectedOn}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </div>
                        <textarea
                            name="followup"
                            className="form-application__followup-input"
                            placeholder="Follow-up (press Enter to save a new note)"
                        />
                    </div>
                </div>
                <div className="form-resume__div-button">
                    <Button
                        className="form-resume__button"
                        size="small"
                        variant="contained"
                        color="secondary"
                        startIcon={<CancelIcon />}
                        onClick={handleCancelBtn}
                    >
                        {' '}
                        Cancel
                    </Button>
                    &nbsp;&nbsp;
                    <button
                        disabled={isFormValid()}
                        className={
                            isFormValid()
                                ? 'Mui-disabled MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-containedSizeSmall MuiButton-sizeSmall'
                                : 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-containedSizeSmall MuiButton-sizeSmall'
                        }
                    >
                        <DoneIcon />
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}

const mapStateToProps = (state) => ({
    resumes: state.resumes
});

const mapDispatchToProps = (dispatch) => ({
    addResume: (data) => dispatch(addResume(data)),
    updateResume: (data) => dispatch(updateResume(data)),
    deleteResume: (data) => dispatch(deleteResume(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormApplication);
