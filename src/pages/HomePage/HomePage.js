import React from 'react';
import TableApplications from '../../components/TableApplications/TableApplications';

function HomePage(props) {
    return (
        <div className="container">
            <h1>Applications</h1>
            <TableApplications />
        </div>
    );
}

export default HomePage;
