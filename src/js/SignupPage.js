// Here we are importing all the required items.
import React from 'react';
import SignupForm from './SignupForm';
// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
// import { Link } from 'react-router-dom';
// import './Styles.scss';
// import List from './List';
// import axios from 'axios';

/**
 * ********************************************
 * 
 * Implement:
 * 
 * https://codesandbox.io/s/2oow9n5p7r?file=/src/SignUpContainer.js
 * 
 * ********************************************
 */

// Here we are creating a react class called App.
class SignupPage extends React.Component  
{
  constructor(props) {
    super(props);

    // State contains any mutable value in the form
    this.state = {
      // Contains error messages for specific components.
      // Specify component by setting the key to that component
      // name and the value to the error message to display.
      errors: {},
      // Contains the key/value pairs for inputed values.
      user: {
        username: "",
        email: "",
        password: "",
        // The second password entered to ensure spelling correctness.
        confirmpw: ""
      },
      // Value for whether the password should be astricts
      showPw: false
    }

    // bind the handlers to the form.
    // this.pwMask = this.pwMask.bind(this);
  }

  // Write the handlers and functionality for everything.

  /**
   * Called when a TextField input is changed. Updates the state
   * to the given input.
   * 
   * @param {*} event the calling TextField
   */
  handleChange(event) {

  }

  /**
   * Called when the password TextField input value is changed. Updates
   * the state of the password to the inputted value, but also updates
   * state values that are used in the component to show password criteria.
   * 
   * @param {*} event the calling TextField (should be the password)
   */
  handlePwChange(event) {

  }

  /**
   * Changes the state of password visibility to the opposite.
   * 
   * @param {*} event the icon which swaps visibility state of password chars. 
   */
  handleShowPw(event) {

  }

  /** 
   * Called after validation of input values given for user. Communicates
   * with the user authentication database and performs functions based on
   * the response.
   * 
   * @param {dictionary} user Key/value pairs for username, password, email
   * that will be submitted to the database.
   */
  submitSignupForm(user) {

  }
 
  /**
   * Called imediately after the submit button is pressed. This function
   * cancels the default submit response and instead runs the function here
   * which validates the username, email, and password before running 
   * submitSignupForm.
   * 
   * @param {*} event the submit button
   */
  validateSignupForm(event) {

  }

  render ()   // Here is the start of the render().
  {
    // Here we are returning the format of the List View.
    return (
      <div>
        <SignupForm
          // Pass the state values and handler functions as parameters
          // to assign to each component.
          onSubmit={this.validateSignupForm}
          onChange={this.handleChange}
          onChangePw={this.handlePwChange}
          onShowPw={this.handleShowPw}
          errors={this.state.errors}
          user={this.state.user}
          pwVisibility={this.state.showPw}
        />
      </div>
    );
  }
}

export default SignupPage;   // Here we are exporting the class called Gallery.