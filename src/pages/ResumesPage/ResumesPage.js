import React, { useState } from 'react';
import FormResume from '../../components/FormResume/FormResume';

function ResumesPage(props) {
    const [toggleForm, setToggleForm] = useState({
        active: false,
        btnMsg: 'Add New Resume'
    });

    const handleClick = () => {
        let msg = '';
        if (toggleForm.active) {
            msg = 'Add New Resume';
        } else {
            msg = 'Cancel';
        }
        setToggleForm({ active: !toggleForm.active, btnMsg: msg });
    };

    return (
        <div>
            <h1>ResumesPage</h1>
            <button onClick={handleClick}>{toggleForm.btnMsg}</button>
            {toggleForm.active && <FormResume />}
        </div>
    );
}

export default ResumesPage;
