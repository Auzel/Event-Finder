// Here we are importing all the required items.
import React from 'react';
import EditAccountForm from './EditAccountForm';
import NavBar from "./NavBar.js"
import '../scss/AccountHistory.scss'

const validator = require("validator");

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
class EditAccountPage extends React.Component  
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
        fullname: ""
      },
    }

    // bind the handlers to 'this'.
    this.handleChangeFullName = this.handleChangeFullName.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.submitEditAccountForm = this.submitEditAccountForm.bind(this);
    this.validateSignupForm = this.validateSignupForm.bind(this);
  }

  // Write the handlers and functionality for everything.

  /**
   * Called when a TextField input is changed. Updates the state
   * to the given input.
   * 
   * @param {*} event the calling TextField
   */
  handleChangeUsername(event) {
    // get the calling TextField
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;


    this.setState({
      user
    });
  }

  handleChangeFullName(event) {
    // get the calling TextField
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;


    this.setState({
      user
    });
  }

    /** 
   * Called after validation of input values given for user. Communicates
   * with the user authentication database and performs functions based on
   * the response.
   * 
   * @param {dictionary} user Key/value pairs for username, password, email
   * that will be submitted to the database.
   */
     submitEditAccountForm(review) {
      console.log("submitting...");
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
      event.preventDefault();
      let errors = this.state.errors;
      errors.message = "";
      
      let hasError = false;
      for (const [key, value] of Object.entries(errors)) {
        if (value != "") hasError = true;
      }
  
      let hasAllInfo = true;
      for (const [key, value] of Object.entries(this.state.user)) {
        if (value == "") hasAllInfo = false;
      }
  
      if (hasError || !hasAllInfo) {
        errors.message = "Please satisfy all requirements.";
      } else {
        console.log("no errors");
        // Actually submit the form
        var user = {
          usr: this.state.user.username,
          pw: this.state.user.password,
          email: this.state.user.email
        }
        this.submitEditAccountForm(user);
      }
      this.setState({
        errors: errors
      });
    }

  render ()   // Here is the start of the render().
  {
    // Here we are returning the format of the List View.
    return (
      <div>

        <NavBar variant="blank" logoLink="/" />

        <EditAccountForm
          // Pass the state values and handler functions as parameters
          // to assign to each component.
          onSubmit={this.validateSignupForm}
          onChangeFullName={this.handleChangeFullName}
          onChangeUsername={this.handleChangeUsername}
          errors={this.state.errors}
          user={this.state.user}
        />
      </div>
    );
  }
}

export default EditAccountPage;