// Here we are importing all the required items.
import React from 'react';
import NavBar from "./NavBar.js";
import "../scss/AccountInformation.scss";
import { Link } from 'react-router-dom';
import NavButton from './NavButton';

// Here we are creating a react class called App.
class AccountInformation extends React.Component  
{
 
  render ()   // Here is the start of the render().
  {
    // Here we are returning the format of the List View.
    return (
      <div>
        
        <NavBar variant="account" logoLink="/" />

        <div class="all">
        <div class="sideBar">

          <div class="informationDiv">

            <Link to = "/AccountInformation" className = "AccountInformationLink"> Information </Link>

          </div>

          <div class="HistoryDiv">

            <Link to = "/AccountHistory" className = "AccountHistoryLink"> History </Link>

          </div>

        </div>

        <div className="accountInformation">

          <div className="headingAI"> ACCOUNT INFORMATION </div>

          <br/>
          <br/>

          <div className="fieldsAI">

            <p> Full Name: </p>

            <br/>

            <p> Username: </p>

            <br/>

            <p> Email: </p>

          </div>

          <br/>
          <br/>

          <div className="linkAI">

            <Link to = "/EditAccountPage" className="editAccountPageLink"> EDIT ACCOUNT </Link>

          </div>

        </div>

        </div>

      </div>
    );
  }
}

export default AccountInformation;   // Here we are exporting the class called Gallery.