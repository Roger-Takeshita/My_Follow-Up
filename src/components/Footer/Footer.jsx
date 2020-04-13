import React from 'react';

import GitHubIcon from '@material-ui/icons/GitHub';

function Footer(props) {
    return (
        <footer>
            <div>
                <a href="https://github.com/roger-takeshita" target="blank">
                    <span>Developed by</span>&nbsp;Roger Takeshita&nbsp;
                    <GitHubIcon />
                </a>
            </div>
        </footer>
    );
}

export default Footer;
