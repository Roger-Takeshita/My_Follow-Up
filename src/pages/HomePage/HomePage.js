import React from 'react';

import ApplicationsPage from '../../pages/ApplicationsPage/ApplicationsPage';

function HomePage({ history }) {
    return (
        <div className="container">
            <ApplicationsPage history={history} />
        </div>
    );
}

export default HomePage;
