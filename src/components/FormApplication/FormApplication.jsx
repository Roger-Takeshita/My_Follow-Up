import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { connect } from 'react-redux';
import apiService from '../../utils/apiService';
import { addApplication, updateApplication, addFollowup } from '../../redux/application';
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
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityIconOff from '@material-ui/icons/VisibilityOff';
import StarIcon from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

function FormApplication(props) {
    const initialState = props.application
        ? {
              title: props.application.title,
              company: props.application.company,
              link: props.application.link,
              jobDescription: props.application.jobDescription,
              resume: props.application.resume,
              appliedOn: props.application.appliedOn !== null ? props.application.appliedOn.split('T')[0] : '',
              rejectedOn: props.application.rejectedOn !== null ? props.application.rejectedOn.split('T')[0] : '',
              status: props.application.status,
              followupNow: '',
              followup: [...props.application.followup],
              coverLetter: props.application.coverLetter,
              coverLetterActive: false,
              star: props.application.star,
              applicationId: props.id
          }
        : {
              title: '',
              company: '',
              link: '',
              jobDescription: '',
              resume: '',
              appliedOn: '',
              rejectedOn: '',
              status: '',
              followupNow: '',
              followup: [],
              coverLetter: '',
              coverLetterActive: false,
              star: false,
              applicationId: ''
          };

    const [form, setForm] = useState(initialState);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleStarClick = (e) => {
        e.preventDefault();
        setForm({
            ...form,
            star: !form.star
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

    const onKeyPress = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (form.applicationId === '') {
                await setForm({
                    ...form,
                    followup: [...form.followup, e.target.value],
                    followupNow: ''
                });
            } else {
                const data = await apiService.postPutData(`/api/application/${form.applicationId}/new`, { description: form.followupNow });
                //= Still need to fix the addFollowup reducer
                props.addFollowup(data);
                setForm(initialState);
            }
        }
    };

    const handleCancelBtn = () => {
        props.history.push('/');
    };

    function isFormValid() {
        return !(form.title && form.company && form.link && form.jobDescription && form.resume && form.status);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (form.applicationId === '') {
                const data = await apiService.postPutData('/api/application/new', form);
                props.addApplication(data);
                setForm(initialState);
            } else {
                const data = await apiService.postPutData(`/api/application`, form, form.applicationId);
                console.log(data);
                //_ Still need to implement the upadateApplication reducer
                // props.addApplication(data);
                // setForm(initialState);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="container">
            <h1>
                {form.title ? form.title.toUpperCase() : 'New Application'}
                {form.company ? ` - ${form.company.toUpperCase()}` : ''}
            </h1>
            <form onSubmit={handleSubmit} className="form-application">
                <div className="form-application__header">
                    <TextField
                        className="form-application__title"
                        label="Job Title"
                        color="primary"
                        name="title"
                        autoComplete="off"
                        value={form.title}
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
                        autoComplete="off"
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
                        autoComplete="off"
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
                        <InputLabel id="demo-controlled-open-select-label">Status</InputLabel>
                        <Select labelId="demo-controlled-open-select-label" name="status" value={form.status} onChange={handleChange}>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Applied">Applied</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>
                    <a href="/" onClick={handleStarClick} className={form.star ? 'form-application__star--true' : 'form-application__star--false'}>
                        <Tooltip title="Save to Favorites" TransitionComponent={Zoom} arrow>
                            <StarIcon />
                        </Tooltip>
                    </a>
                </div>
                <div className="form-application__forms">
                    <div className="form-application__form-job">
                        <div className="form-application__form-title">Job Description</div>
                        <Editor
                            apiKey="zkqnr88xpimb3d5neqkp3rtzm2ecyu7s5v7j23ov5102hvbb"
                            value={form.jobDescription}
                            init={{
                                height: 400,
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
                        <div className="form-application__form-title">Resume</div>
                        <Editor
                            apiKey="zkqnr88xpimb3d5neqkp3rtzm2ecyu7s5v7j23ov5102hvbb"
                            value={form.resume}
                            init={{
                                templates: [
                                    {
                                        title: 'Select a Resume',
                                        description: '',
                                        content: ''
                                    },
                                    ...props.resumes.map((resume) => {
                                        return {
                                            title: resume.title,
                                            description: '',
                                            content: resume.description
                                        };
                                    })
                                ],
                                height: 400,
                                width: '100%',
                                menubar: true,
                                plugins: `print preview paste importcss searchreplace autolink autosave save directionality code 
                                    visualblocks visualchars fullscreen image link media template codesample table charmap hr 
                                    pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern 
                                    noneditable help charmap emoticons`,

                                toolbar: `fullscreen print template | undo redo | bold italic underline strikethrough | 
                                fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | 
                                outdent indent | numlist bullist | forecolor backcolor removeformat | pagebreak emoticons| 
                                image media link anchor | help`
                            }}
                            onEditorChange={handleResumeEditorChange}
                        />
                    </div>
                </div>
                <div className="form-application__followup">
                    <div className="form-application__followup-display">
                        <div className="form-application__followup-title">
                            {form.followup.length > 0 ? `Follow-ups (${form.followup.length})` : 'No Follow-ups'}
                        </div>
                        <div className="form-application__followup-list">
                            <ul className="form-application__followup-list-ul">
                                {form.followup.length > 0
                                    ? form.followup.map((follow, idx) => {
                                          return (
                                              <li className="form-application__followup-list-li" key={idx}>
                                                  <span className="form-application__followup-list-span">[{follow.date.split('T')[0]}]</span>&nbsp;-&nbsp;
                                                  {follow.description}
                                              </li>
                                          );
                                      })
                                    : ''}
                            </ul>
                        </div>
                    </div>
                    <div className="form-application__followup-list-input">
                        {form.coverLetterActive && (
                            <div className="form-application__form-cl">
                                <div className="form-application__form-title">Cover Letter</div>
                                <Editor
                                    apiKey="zkqnr88xpimb3d5neqkp3rtzm2ecyu7s5v7j23ov5102hvbb"
                                    value={form.coverLetter}
                                    init={{
                                        height: 400,
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
                                    onEditorChange={handleCoverLetterEditorChange}
                                />
                            </div>
                        )}
                        <div className="form-application__followup-ctrl">
                            <a
                                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedSizeSmall MuiButton-sizeSmall a-show-hide"
                                href="/"
                                onClick={handleCoverLetterVisible}
                            >
                                {form.coverLetterActive ? <VisibilityIconOff /> : <VisibilityIcon />}
                                &nbsp;&nbsp;
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
                        <div className="form-application__form-followup">
                            <textarea
                                name="followupNow"
                                className="form-application__followup-input"
                                placeholder="Follow-up (press Enter to save a new note)"
                                onKeyPress={onKeyPress}
                                onChange={handleChange}
                                value={form.followupNow}
                            />
                        </div>
                        <div className="form-application__ctrl">
                            <Button
                                className="form-application__button"
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
                    </div>
                </div>
            </form>
        </div>
    );
}

const mapStateToProps = (state) => ({
    resumes: state.resume
});

const mapDispatchToProps = (dispatch) => ({
    addApplication: (data) => dispatch(addApplication(data)),
    updateApplication: (data) => dispatch(updateApplication(data)),
    addFollowup: (data) => dispatch(addFollowup(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormApplication);
