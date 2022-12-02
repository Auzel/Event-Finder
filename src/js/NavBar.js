import React from 'react';
import '../scss/NavBar.scss'
import Eventology from '../assets/Logo_Banner.png';
import { Link } from 'react-router-dom';
import NavButton from './NavButton';
import PropTypes from 'prop-types';

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
    }

    logoImg() {
        return (
            <Link className='logoLink' to={this.props.logoLink}>
                <img src={Eventology} className='navBarImg' alt="HI"/>
            </Link>
        )
    }

    render() {
        if (!this.props.variant || this.props.variant == "blank") {
            return (
                <div className='navBar'>
                    {this.logoImg()}
                </div>
            )
        } else if (this.props.variant == "map") {
            return (
                <div className='navBar'>
                    {this.logoImg()}
                    <div className='navButtons'>
                        <div className='navBarButtonDiv'>
                            <NavButton className="navBarButton" to="/AccountInformation" variant="small" text="ACCOUNT"/>
                        </div>
                        <div className='navBarButtonDiv'>
                            <NavButton className="navBarButton" to="/" variant="small" text="LOGOUT"/>
                        </div>
                    </div>
                </div>
            )
        } else if (this.props.variant == "account") {
            return (
                <div className='navBar'>
                    {this.logoImg()}
                    <div className='navButtons'>
                        <div className='navBarButtonDiv'>
                            <NavButton className="navBarButton" to="/Map" variant="small" text="MAP"/>
                        </div>
                        <div className='navBarButtonDiv'>
                            <NavButton className="navBarButton" to="/" variant="small" text="LOGOUT"/>
                        </div>
                    </div>
                </div>
            )
        } else if (this.props.variant == "review") {
            return (
                <div className='navBar'>
                    {this.logoImg()}
                    <div className='navButtons'>
                        <div className='navBarButtonDiv'>
                            <NavButton className="navBarButton" to="/AccountInformation" variant="small" text="ACCOUNT"/>
                        </div>
                        <div className='navBarButtonDiv'>
                            <NavButton className="navBarButton" to="/Map" variant="small" text="MAP"/>
                        </div>
                        <div className='navBarButtonDiv'>
                            <NavButton className="navBarButton" to="/" variant="small" text="LOGOUT"/>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

NavBar.propTypes = {
    logoLink: PropTypes.string,
    variant: PropTypes.string
}

NavBar.defaultProps = {
    logoLink: "/"
}