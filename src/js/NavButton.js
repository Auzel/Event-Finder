import React from 'react';
import '../scss/NavButton.scss'
import Eventology from '../assets/Logo_Banner.png';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class NavButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const variant = this.props.variant ? this.props.variant : "";
        const size = (variant == "large") ? "large" : "small";
        return (
            <div className={'navButton ' + size + ' ' + this.props.className}>
                <Link className='buttonLink' to={this.props.to}>
                    {this.props.text}
                </Link>
            </div>
        )
    }
}

NavButton.propTypes = {
    to: PropTypes.string.isRequired,
    variant: PropTypes.string,
    text: PropTypes.string,
    className: PropTypes.string
}

NavButton.defaultProps = {
    className: ""
}