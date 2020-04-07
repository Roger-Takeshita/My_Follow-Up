import React, { useState, useEffect } from 'react';
import Fade from '@material-ui/core/Fade';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

function ErrorMessage({ message, doneMessage }) {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        setFade(true);
        const timer = setTimeout(() => {
            setFade(false);
            doneMessage();
        }, 5000);
        return () => {
            clearTimeout(timer);
        };
    }, [message, doneMessage]);

    return (
        <Fade in={fade} timeout={500}>
            <div className="error-message">
                <ReportProblemIcon />
                &nbsp;&nbsp;
                {message}
            </div>
        </Fade>
    );
}

export default ErrorMessage;
