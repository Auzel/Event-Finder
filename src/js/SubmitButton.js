import React from 'react';
import '../scss/SubmitButton.scss'
import Eventology from '../assets/Logo_Banner.png';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class SubmitButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const variant = this.props.variant ? this.props.variant : "";
        const size = (variant == "large") ? "large" : "small";
        return (
            // <div className={'navButton ' + size + ' ' + this.props.className}>
            <div>
                <button className={'submitButton ' + size + ' ' + this.props.className} type='submit'>{this.props.text}</button>
                {/* <Link className='buttonLink' to={this.props.to}>
                    {this.props.text}
                </Link> */}
            </div>
        )
    }
}

SubmitButton.propTypes = {
    variant: PropTypes.string,
    text: PropTypes.string,
    className: PropTypes.string
}

SubmitButton.defaultProps = {
    className: ""
}