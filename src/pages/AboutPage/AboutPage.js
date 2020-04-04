import React from 'react';
import { iconsSvg } from '../../assets/iconsSvg';
import { iconsSocialMedia } from '../../assets/iconsSocialMedia';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

function AboutPage(props) {
    return (
        <div className="container">
            <h1>About Me</h1>
            <div className="about__div">
                <img className="about__img" src="https://avatars3.githubusercontent.com/u/32579177?s=460&v=4" alt="profile-pic" />
                <div className="about__name">Roger Takeshita</div>
                <div className="about__title">
                    <strong>Full-Stack Developer</strong>
                </div>
                <div className="about__technologies">
                    <div>This website was developed using:</div>
                    <div className="about__icons">
                        {iconsSvg.map((icon, idx) => {
                            return (
                                <div key={idx} className="about__icon">
                                    {icon.iconSvgDescription}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="about__social-media">
                    <div>Follow me at:</div>
                    <div className="about__icons">
                        {iconsSocialMedia.map((icon, idx) => {
                            return (
                                <Tooltip key={idx} title={icon.name} TransitionComponent={Zoom} placement={icon.placement}>
                                    <a href={icon.link} target="blank">
                                        <img src={icon.iconSvg} alt="logo" className="about__icon-social-media" />
                                    </a>
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>
                <div className="about__website">
                    <a href="www.rogertakeshita.com" target="blank">
                        www.rogertakeshita.com
                    </a>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
