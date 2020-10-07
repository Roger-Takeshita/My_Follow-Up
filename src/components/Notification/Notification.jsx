import React from 'react';

function Notification({ text, open }) {
    return (
        <div className={open ? 'notify notify--open' : 'notify notify--close'}>
            <p className="notify__text notify__text--strong">Copied: </p>
            <p className="notify__text">{text}</p>
        </div>
    );
}

export default Notification;
