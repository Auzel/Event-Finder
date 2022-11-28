// Here we are importing all the required items.
import React from 'react';
import { Link } from 'react-router-dom';
import Eventology from './Logo_Banner.png';
import './LandingPage.scss';

// Here we are creating a react class called App.
class LandingPage extends React.Component  
{
 
  render ()   // Here is the start of the render().
  {
    // Here we are returning the format of the List View.
    return (
        <div>

          <div className="header">

            <Link to={'/'}>

              <img src={Eventology} className='headerImage' alt="HI"/>

            </Link>

          </div>

          <br></br>
          <br></br>
          <br></br>
          <br></br>

          <div className="buttonContainerDiv">

            <div className="buttonContainerDivOne">

              <img src={Eventology} className='buttonContainerDivImage' alt="HI"/>

              <br></br>
              <br></br>
              <br></br>
              <br></br>

              <div className="links">

                <Link className="LoginPageLink" to={'/LoginPage'}>Login</Link>

                <Link className="SignupPageLink" to={'/SignupPage'}>Signup</Link>

              </div>

            </div>

            <div className="styleDivOne">

            </div>

          </div>

          <div className="featureOne">

            <div className="styleDivTwo">

            </div>

            <div className="featureOneText">

              <h3>Feature One</h3>

              <p>See events from Ticketmaster, Stubhub, etc. All in one centralized map.</p>

            </div>

          </div>

          <div className="featureTwo">

            <div className="featureTwoText">

              <h3>Feature Two</h3>

              <p>Change your account information and event preferences at any time you desire.</p>

            </div>

            <div className="styleDivThree">

            </div>

          </div>

          <div className="featureThree">

            <div className="styleDivFour">

            </div>

            <div className="featureThreeText">

              <h3>Feature Three</h3>

              <p> See a record of the events you have clicked on, and a record of the venues you have reviewed.</p>

            </div>

          </div>

          <div className="footer">

            <p>Copy Right @2022</p>

          </div>

        </div>
    );
  }
}

export default LandingPage;   // Here we are exporting the class called Gallery.