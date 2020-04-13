import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import FormResume from '../../components/FormResume/FormResume';
import TableSimple from '../../components/TableSimple/TableSimple';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';

function ResumesPage({ history, resumes, match }) {
    const [displayForm, setDisplayForm] = useState(false);
    const [resume, setResume] = useState({});

    const handleDisplayForm = (status) => {
        setDisplayForm(status);
    };

    useEffect(() => {
        async function findResume() {
            const resume = await resumes.find(({ _id }) => _id === match.params.id);
            if (resume) {
                setResume(resume);
            }
        }
        match && findResume();
    }, [resumes, match]);

    return (
        <div className="container">
            {displayForm || match ? '' : <h1>Resumes</h1>}
            {match ? (
                ''
            ) : (
                <div className="form-resume__editor-ctrl" style={{ display: displayForm ? 'none' : 'flex' }}>
                    <Button
                        onClick={() => handleDisplayForm(true)}
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<AddBoxIcon />}
                    >
                        New Resume
                    </Button>
                </div>
            )}
            {(displayForm || match) && (
                <FormResume history={history} handleDisplayForm={handleDisplayForm} resume={resume} />
            )}
            <TableSimple resumes={resumes} />
        </div>
    );
}

const mapStateToProps = (state) => ({
    resumes: state.resume
});

export default connect(mapStateToProps)(ResumesPage);
