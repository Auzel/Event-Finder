// Here we are importing all the required items.
import React from 'react';
import { Link } from 'react-router-dom';

// Here we are creating a react class called App.
class LandingPage extends React.Component  
{
 
  render ()   // Here is the start of the render().
  {
    // Here we are returning the format of the List View.
    return (
        <div>
            <div className="buttonContainerDiv">
                <Link to={'/LoginPage'}>Login Page</Link>
                <br></br>
                <Link to={'/SignupPage'}>Signup Page</Link>
            </div>
        </div>
    );
  }
}

export default LandingPage;   // Here we are exporting the class called Gallery.