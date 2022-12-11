// Here we are importing all the required items.
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import Eventology from "../assets/Logo_Banner.png"
import '../scss/LandingPage.scss';
import NavButton from './NavButton';

class LandingPage extends React.Component  
{
  render ()
  {
    return (
        <div>
          <div id="mainLandingDiv">
            <div className='headerLanding'>
              <NavBar variant="blank" logoLink="/" />
            </div>
            <div className="buttonContainerDiv">
              <div className="buttonContainerDivOne">
                <div className='mainLogoLandingDiv'>
                  <img src={Eventology} className='buttonContainerDivImage' alt="HI"/>
                </div>
                <div className="links">
                  <NavButton className="LoginPageLink" to={'/LoginPage'} text="LOGIN" variant="large"/>
                  <NavButton className="SignupPageLink" to={'/SignupPage'} text="SIGN UP" variant="large"/>
                </div>
              </div>
              <div className='sideImgDiv'>
                {/* <img src="https://www.pngall.com/wp-content/uploads/4/Concert-Crowd-PNG-Image.png"></img> */}
                <div id="landingH1">A Centeralized Map Explorer for Event Websites like Ticketmaster</div>
              </div>
            </div>
            <div className="footer">

                <p>Copyright @2022</p>

            </div>
          </div>
        </div>
            /* <div className="styleDivOne">

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

          

        </div> */
    );
  }
}

export default LandingPage;   // Here we are exporting the class called Gallery.