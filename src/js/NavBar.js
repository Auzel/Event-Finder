import React from 'react';
import '../scss/NavBar.scss'
import Eventology from '../assets/Logo_Banner.png';
import { Link } from 'react-router-dom';
import NavButton from './NavButton';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';
import { setToken } from './token';
import { setUserId } from './userId';

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        console.log("logging out");
        sessionStorage.clear();
        window.location = "https://nickwinkler.web.illinois.edu/";
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
                    <div className='logoWLoading'>
                        {this.logoImg()}
                        {this.props.loadingIcon ? <div className='progressCircle'><CircularProgress style={{'color': "#415380"}}/></div> : <></>}
                        {this.props.unauthorized ? <div className='unauthorizedText'>Please login to use this page</div> : <></>}
                    </div>
                    <div className='navButtons'>
                        <div className='navBarButtonDiv'>
                            <NavButton className="navBarButton" to="/AccountInformation" variant="small" text="ACCOUNT"/>
                        </div>
                        <div className='navBarButtonDiv'>
                            <div id="logoutButton" onClick={this.handleLogout}>LOGOUT</div>
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
                            <div id="logoutButton" onClick={this.handleLogout}>LOGOUT</div>
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
                            <div id="logoutButton" onClick={this.handleLogout}>LOGOUT</div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

NavBar.propTypes = {
    logoLink: PropTypes.string,
    variant: PropTypes.string,
    loadingIcon: PropTypes.bool
}

NavBar.defaultProps = {
    logoLink: "/",
    loadingIcon: false
}