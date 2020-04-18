import React, { useState, useEffect } from 'react';
import apiService from '../../utils/apiService';
import {
    addApplication,
    updateApplication,
    addFollowup,
    updateFollowup,
    deleteFollowup
} from '../../redux/application';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import FormDialog from '../../components/FormDialog/FormDialog';
import { Editor } from '@tinymce/tinymce-react';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import InputLabel from '@material-ui/core/InputLabel';
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
import FormHelperText from '@material-ui/core/FormHelperText';

function FormApplication({
    application,
    resumes,
    addFollowup,
    updateFollowup,
    deleteFollowup,
    history,
    addApplication,
    updateApplication,
    handleUpdate,
    fromPage
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
    const [formFollowup, setFormFollowup] = useState({
        followupIdx: '',
        parentId: '',
        followupId: '',
        description: '',
        date: '',
        toggle: false
    });

    useEffect(() => {
        function getApplication() {
            setForm(
                application
                    ? {
                          title: application.title,
                          company: application.company,
                          link: application.link,
                          jobDescription: application.jobDescription,
                          resume: application.resume,
                          appliedOn:
                              application.appliedOn !== null ? application.appliedOn.split('T')[0] : '',
                          rejectedOn:
                              application.rejectedOn !== null ? application.rejectedOn.split('T')[0] : '',
                          status: application.status,
                          followupNow: '',
                          followup: [...application.followup],
                          coverLetter: application.coverLetter,
                          coverLetterActive: false,
                          star: application.star,
                          applicationId: application._id,
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
    }, [application]);

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

    const handleToggleFormFollowup = (e, data) => {
        e.preventDefault();
        setFormFollowup({
            followupIdx: data.followupIdx,
            parentId: form.applicationId,
            followupId: data.followupId,
            description: data.description,
            date: data.date,
            toggle: true
        });
    };

    const handleDeleteFollowup = async (e, applicationId, followupId, idx) => {
        e.preventDefault();
        if (applicationId) {
            try {
                await apiService.deleteData('/api/applications/', {
                    parentId: applicationId,
                    childId: followupId
                });
                deleteFollowup({ applicationId, idx });
            } catch (err) {
                console.log(err.message);
                setForm({ ...form, message: err.message });
            }
        } else {
            setForm({
                ...form,
                followup: [
                    ...form.followup.slice(0, idx),
                    ...form.followup.slice(idx + 1, form.followup.length)
                ]
            });
        }
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
                setForm({
                    ...form,
                    followup: [...form.followup, e.target.value],
                    followupNow: ''
                });
            } else {
                try {
                    const data = await apiService.postData(`/api/applications`, {
                        parentId: form.applicationId,
                        data: { description: form.followupNow }
                    });
                    addFollowup({ data, applicationId: form.applicationId });
                    setForm({
                        ...form,
                        followup: [
                            ...form.followup,
                            { _id: data._id, description: data.description, date: data.date }
                        ],
                        followupNow: ''
                    });
                } catch (err) {
                    console.log(err.message);
                    setForm({ ...form, message: err.message });
                }
            }
        }
    };

    const handleUpdateFollowup = async (data) => {
        const followup = await apiService.putData('/api/applications', {
            parentId: data.parentId,
            childId: data.followupId,
            data: data
        });
        updateFollowup({ followupIdx: formFollowup.followupIdx, parentId: data.parentId, data: followup });
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
                addApplication(data);
                setForm(initialState);
            } else {
                const data = await apiService.putData(`/api/applications`, {
                    data: form,
                    parentId: form.applicationId
                });
                updateApplication(data);
                application && fromPage && handleUpdate(data);
                history.goBack();
            }
        } catch (err) {
            console.log(err);
            setForm({
                ...form,
                message: err.message
            });
        }
    }

    const doneMessage = () => {
        setForm({ ...form, message: '' });
    };

    return (
        <div className="container">
            <h1>
                {form.title ? form.title.toUpperCase() : 'New Application'}
                {form.company ? ` - ${form.company.toUpperCase()}` : ''}
            </h1>
            <form onSubmit={handleSubmit} className="form-application">
                <div className="form-application__header">
                    <TextField
                        required
                        className="form-application__title"
                        label="Job Title"
                        color="primary"
                        name="title"
                        autoComplete="off"
                        value={form.title}
                        onChange={handleChange}
                        helperText="* Required"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <DescriptionIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        required
                        className="form-application__company"
                        label="Company"
                        color="primary"
                        name="company"
                        autoComplete="off"
                        value={form.company}
                        onChange={handleChange}
                        helperText="* Required"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BusinessIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        required
                        className="form-application__link"
                        label="Link"
                        color="primary"
                        name="link"
                        autoComplete="off"
                        value={form.link}
                        onChange={handleChange}
                        helperText={application ? `ID: ${application._id}` : '* Required'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LinkIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    <FormControl required className="form-application__status">
                        <InputLabel htmlFor="status-app">Status</InputLabel>
                        <Select
                            native
                            value={form.status}
                            onChange={handleChange}
                            name="status"
                            inputProps={{
                                id: 'status-app'
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={'Pending'}>Pending</option>
                            <option value={'Applied'}>Applied</option>
                            <option value={'Rejected'}>Rejected</option>
                        </Select>
                        <FormHelperText>* Required</FormHelperText>
                    </FormControl>
                    <div className="form-application__star">
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
                </div>
                <div className="form-application__forms">
                    <div className="form-application__form-job">
                        <div className="form-application__form-title">Job Description*</div>
                        <div className="form-application__form-title-req">* Required</div>
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
                            onEditorChange={(e) => handleEditorChange(e, 'job')}
                        />
                    </div>
                    <div className="form-application__form-resume">
                        <div className="form-application__form-title">Resume*</div>
                        <div className="form-application__form-title-req">* Required</div>
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
                                                              placement="left"
                                                              arrow
                                                          >
                                                              <DeleteOutlineIcon />
                                                          </Tooltip>
                                                      </a>
                                                      <Tooltip
                                                          title="Click to Edit"
                                                          TransitionComponent={Zoom}
                                                          placement="right"
                                                          arrow
                                                      >
                                                          <Link
                                                              to="/"
                                                              onClick={(e) =>
                                                                  handleToggleFormFollowup(e, {
                                                                      followupIdx: idx,
                                                                      followupId: follow._id,
                                                                      description: follow.description,
                                                                      date: follow.date
                                                                  })
                                                              }
                                                          >
                                                              <span className="form-application__followup-span">
                                                                  {application
                                                                      ? `[${follow.date.split('T')[0]}]`
                                                                      : new Date()
                                                                            .toISOString()
                                                                            .split('T')[0]}
                                                              </span>
                                                          </Link>
                                                      </Tooltip>
                                                  </div>
                                                  <div className="form-application__followup-text">
                                                      <span>{application ? follow.description : follow}</span>
                                                  </div>
                                              </div>
                                          </div>
                                      );
                                  })
                                : ''}
                        </div>
                        <FormDialog formFollowup={formFollowup} handleUpdateFollowup={handleUpdateFollowup} />
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
                                onClick={() => history.goBack()}
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
                        {form.message !== '' ? (
                            <ErrorMessage message={form.message} doneMessage={doneMessage} />
                        ) : (
                            ''
                        )}
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
    addFollowup: (data) => dispatch(addFollowup(data)),
    updateFollowup: (data) => dispatch(updateFollowup(data)),
    deleteFollowup: (data) => dispatch(deleteFollowup(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormApplication);
