import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { connect } from 'react-redux';
import apiService from '../../utils/apiService';
import { addApplication, updateApplication, addFollowup, deleteFollowup } from '../../redux/application';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import PublishIcon from '@material-ui/icons/Publish';
import UpdateIcon from '@material-ui/icons/Update';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

function FormApplication({
    applications,
    application,
    id,
    resumes,
    deleteFollowup,
    addFollowup,
    history,
    addApplication,
    updateApplication
}) {
    const initialState = {
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
        applicationId: '',
        modifiedFlag: false,
        message: ''
    };

    const [form, setForm] = useState(initialState);

    useEffect(() => {
        function getApplication() {
            const updateApplication = applications.find(({ _id }) => _id === id);
            setForm(
                updateApplication
                    ? {
                          title: updateApplication.title,
                          company: updateApplication.company,
                          link: updateApplication.link,
                          jobDescription: updateApplication.jobDescription,
                          resume: updateApplication.resume,
                          appliedOn:
                              updateApplication.appliedOn !== null
                                  ? updateApplication.appliedOn.split('T')[0]
                                  : '',
                          rejectedOn:
                              updateApplication.rejectedOn !== null
                                  ? updateApplication.rejectedOn.split('T')[0]
                                  : '',
                          status: updateApplication.status,
                          followupNow: '',
                          followup: [...updateApplication.followup],
                          coverLetter: updateApplication.coverLetter,
                          coverLetterActive: false,
                          star: updateApplication.star,
                          applicationId: id,
                          modifiedFlag: false,
                          message: ''
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
                          applicationId: '',
                          modifiedFlag: false,
                          message: ''
                      }
            );
        }
        getApplication();
    }, [applications, id]);

    const handleChange = ({ target: { name, value } }) => {
        setForm({
            ...form,
            [name]: value,
            modifiedFlag: true,
            message: ''
        });
    };

    const handleStarClick = (e) => {
        e.preventDefault();
        setForm({
            ...form,
            star: !form.star,
            modifiedFlag: true,
            message: ''
        });
    };

    const handleDeleteFollowup = async (e, applicationId, followupId, idx) => {
        e.preventDefault();
        await apiService.deleteData('/api/applications/', { parentID: applicationId, childId: followupId });
        deleteFollowup({ applicationId, idx });
    };

    const handleEditorChange = (content, editor) => {
        if (editor === 'job') {
            setForm({
                ...form,
                jobDescription: content,
                modifiedFlag: true
            });
        } else if (editor === 'resume') {
            setForm({
                ...form,
                resume: content,
                modifiedFlag: true
            });
        } else if (editor === 'coverLetter') {
            setForm({
                ...form,
                coverLetter: content,
                modifiedFlag: true
            });
        }
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
                const data = await apiService.postData(`/api/applications`, {
                    parentId: form.applicationId,
                    data: { description: form.followupNow }
                });
                await addFollowup({ data, applicationId: form.applicationId });
                await setForm({
                    ...form,
                    followup: [
                        ...form.followup,
                        { _id: data._id, description: data.description, date: data.date }
                    ],
                    followupNow: ''
                });
            }
        }
    };

    function isFormValid() {
        return !(
            form.title &&
            form.company &&
            form.link &&
            form.jobDescription &&
            form.resume &&
            form.status &&
            form.modifiedFlag
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (form.applicationId === '') {
                const data = await apiService.postData('/api/applications', { data: form });
                console.log(data);
                addApplication(data);
            } else {
                console.log(form.applicationId);
                const data = await apiService.putData(`/api/applications`, {
                    data: form,
                    parentId: form.applicationId
                });
                updateApplication(data);
            }
            history.push('/');
        } catch (err) {
            setForm({
                ...form,
                message: err.message
            });
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
                        <Select
                            labelId="demo-controlled-open-select-label"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Applied">Applied</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>
                    <a
                        href="/"
                        onClick={handleStarClick}
                        className={
                            form.star ? 'form-application__star--true' : 'form-application__star--false'
                        }
                    >
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
                                height: 440,
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
                            onEditorChange={(e) => handleEditorChange(e, 'job')}
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
                                    ...resumes.map((resume) => {
                                        return {
                                            title: resume.title,
                                            description: '',
                                            content: resume.description
                                        };
                                    })
                                ],
                                height: 440,
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
                            onEditorChange={(e) => handleEditorChange(e, 'resume')}
                        />
                    </div>
                </div>
                <div className="form-application__followup">
                    <div className="form-application__followup-display">
                        <div className="form-application__form-title">
                            {form.followup.length > 0
                                ? `Follow-ups (${form.followup.length})`
                                : 'No Follow-ups'}
                        </div>
                        <div className="form-application__followup-list">
                            {form.followup.length > 0
                                ? form.followup.map((follow, idx) => {
                                      return (
                                          <div key={idx}>
                                              <hr />
                                              <div className="form-application__followup-item">
                                                  <div className="form-application__followup-date">
                                                      <span className="form-application__followup-span">
                                                          {application
                                                              ? `[${follow.date.split('T')[0]}]`
                                                              : new Date().toISOString().split('T')[0]}
                                                      </span>
                                                      <a
                                                          href="/"
                                                          onClick={(e) =>
                                                              handleDeleteFollowup(
                                                                  e,
                                                                  form.applicationId,
                                                                  follow._id,
                                                                  idx
                                                              )
                                                          }
                                                      >
                                                          <Tooltip
                                                              title="Delete"
                                                              TransitionComponent={Zoom}
                                                              placement="right"
                                                              arrow
                                                          >
                                                              <DeleteOutlineIcon />
                                                          </Tooltip>
                                                      </a>
                                                  </div>
                                                  <div className="form-application__followup-text">
                                                      {application ? follow.description : follow}
                                                  </div>
                                              </div>
                                          </div>
                                      );
                                  })
                                : ''}
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
                                    onEditorChange={(e) => handleEditorChange(e, 'coverLetter')}
                                />
                            </div>
                        )}
                        <div className="form-application__followup-ctrl">
                            <Button
                                className="form-application__show-hide--icon"
                                size="small"
                                variant="contained"
                                startIcon={
                                    form.coverLetterActive ? <VisibilityIconOff /> : <VisibilityIcon />
                                }
                                onClick={handleCoverLetterVisible}
                            >
                                {form.coverLetterActive ? 'Hide CL' : 'Show CL'}
                            </Button>
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
                                onClick={() => history.push('/')}
                            >
                                {' '}
                                Cancel
                            </Button>
                            &nbsp;&nbsp;
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={form.applicationId !== '' ? <UpdateIcon /> : <PublishIcon />}
                                className={
                                    isFormValid()
                                        ? 'Mui-disabled form-application__button'
                                        : 'form-application__button'
                                }
                            >
                                {form.applicationId !== '' ? 'Update Application' : 'Save Application'}
                            </Button>
                        </div>
                        <div
                            className="form-application__message"
                            style={{ display: form.message !== '' ? 'flex' : 'none' }}
                        >
                            <ReportProblemIcon />
                            {form.message}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

const mapStateToProps = (state) => ({
    resumes: state.resume,
    applications: state.application
});

const mapDispatchToProps = (dispatch) => ({
    addApplication: (data) => dispatch(addApplication(data)),
    updateApplication: (data) => dispatch(updateApplication(data)),
    addFollowup: (data) => dispatch(addFollowup(data)),
    deleteFollowup: (data) => dispatch(deleteFollowup(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormApplication);
