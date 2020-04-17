import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({ formFollowup, handleUpdateFollowup }) {
    const [followup, setFollowup] = useState({
        parentId: '',
        followupId: '',
        description: '',
        date: '',
        modifiedFlag: false
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setFollowup({
            parentId: formFollowup.parentId,
            followupId: formFollowup.followupId,
            description: formFollowup.description,
            date: formFollowup.date !== null ? formFollowup.date.split('T')[0] : '',
            modifiedFlag: false
        });
        if (formFollowup.toggle) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [formFollowup]);

    const handleClose = (status) => {
        setOpen(false);
        if (status === 'submit') {
            handleUpdateFollowup(followup);
        }
    };

    const handleChange = ({ target: { name, value } }) => {
        setFollowup({
            ...followup,
            [name]: value,
            modifiedFlag: true
        });
    };

    function isFormValid() {
        return !(followup.description && followup.date && followup.modifiedFlag);
    }

    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="form-dialog-title"
                fullWidth={true}
                className="form-followup"
            >
                <DialogTitle id="form-dialog-title">Update Follow-up</DialogTitle>
                <DialogContent className="form-followup__info">
                    <TextField
                        className="form-followup__date"
                        label="On Date"
                        type="date"
                        name="date"
                        value={followup.date}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <textarea
                        name="description"
                        className="form-followup__input"
                        onChange={handleChange}
                        value={followup.description}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose('cancel')} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleClose('submit')}
                        color="primary"
                        className={
                            isFormValid()
                                ? 'Mui-disabled form-application__button'
                                : 'form-application__button'
                        }
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
