// Here we are importing all the required items.
import React from 'react';
import { Link } from 'react-router-dom';
import Eventology from './Logo_Banner.png';
import './LoginPage.scss';



// Here we are creating a react class called App.
class LoginPage extends React.Component  
{
 
  render ()   // Here is the start of the render().
  {
    // Here we are returning the format of the List View.
    return (
      <div>
        {/* <div className="headerTwo">

          <Link to={'/'}>

            <img src={Eventology} className='headerImageTwo' alt="HI"/>

          </Link>

        </div>

        <div className="login"> 

          <h6>LOGIN</h6>

          <p>Username:</p>

          <input placeholder="Enter Your Username"/>

          <p>Password:</p>

          <input placeholder="Enter Your Password"/>
        
        </div> */}

      </div>
    );
  }
}

export default LoginPage;   // Here we are exporting the class called Gallery.