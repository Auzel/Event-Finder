// Here we are importing all the required items.
import React from 'react';
import NavBar from "./NavBar.js";
import "../scss/AccountHistory.scss";
import { Link } from 'react-router-dom';

// Here we are creating a react class called App.
class AccountHistory extends React.Component  
{
 
  render ()   // Here is the start of the render().
  {
    // Here we are returning the format of the List View.
    return (
      <div>
        
        <NavBar variant="account" logoLink="/" />

        <div class="sideBar">

          <div class="informationDiv">

            <Link to = "/AccountInformation" className = "AccountInformationLink"> Information </Link>

          </div>

          <div class="HistoryDiv">

            <Link to = "/AccountHistory" className = "AccountHistoryLink"> History </Link>

          </div>
          
        </div>

      </div>
    );
  }
}

export default AccountHistory;   // Here we are exporting the class called Gallery.