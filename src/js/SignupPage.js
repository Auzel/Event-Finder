// Here we are importing all the required items.
import React from 'react';
import SignupForm from './SignupForm';
import NavBar from "./NavBar.js"
import axios from 'axios';

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
        confirmpw: "",
        fullname: ""
      },
      // Value for whether the password should be astricts
      showPw: false
    }
    // this.axios=null;

    this.axios = axios.create({baseURL: 'http://localhost:4000/api', timeout: 3000});

    // bind the handlers to 'this'.
    this.handleChangeFullName = this.handleChangeFullName.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handlePwChange = this.handlePwChange.bind(this);
    this.handleShowPw = this.handleShowPw.bind(this);
    this.handleConfirmPwChange = this.handleConfirmPwChange.bind(this);
    this.submitSignupForm = this.submitSignupForm.bind(this);
    this.validateSignupForm = this.validateSignupForm.bind(this);
  }

  // Write the handlers and functionality for everything.

  /**
   * Called when a TextField input is changed. Updates the state
   * to the given input.
   * 
   * @param {*} event the calling TextField
   */
   handleChangeFullName(event) {
    // get the calling TextField
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;


    this.setState({
      user
    });
  }
  
  handleChangeUsername(event) {
    // get the calling TextField
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;


    this.setState({
      user
    });
  }

  handleChangeEmail(event) {
    // get the calling TextField
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;


    this.setState({
      user
    });

    // Validate the email
    let errors = this.state.errors;
    if (
      event.target.value &&
      !validator.isEmail(event.target.value)
    ) {
      errors['email'] = "Please provide a correct email address.";
    } else {
      errors['email'] = "";
    }

    this.setState({
      errors: errors
    })
  }

  /**
   * Called when the password TextField input value is changed. Updates
   * the state of the password to the inputted value, but also updates
   * state values that are used in the component to show password criteria.
   * 
   * @param {*} event the calling TextField (should be the password)
   */
  handlePwChange(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });

    // Validate the password and update the state for radio icons accordingly
    let isempty = event.target.value ? false : true;
    let hasSpecialChar = this.containsSpecialChars(event.target.value);
    let hasCorrectLen = (event.target.value && event.target.value.length >= 8) ? true : false;

    let errors = this.state.errors;
    if (isempty) {
      errors.password = "";
    } else if (!hasSpecialChar && !hasCorrectLen) {
      errors.password = "Password must be greater than 8 characters and contain one special character.";
    } else if (!hasSpecialChar) {
      errors.password = "Password must contain one special character.";
    } else if (!hasCorrectLen) {
      errors.password = "Password must be greater than 8 characters.";
    } else {
      errors.password = ""
    }

    this.setState({
      errors: errors
    })
  }

  handleConfirmPwChange(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });

    let errors = this.state.errors;
    if (event.target.value && (event.target.value !== this.state.user.password)) {
      errors["confirmpw"] = "Passwords do not match.";
    } else {
      errors["confirmpw"] = "";
    }

    this.setState({
      errors: errors
    });
  }

  /**
   * Changes the state of password visibility to the opposite.
   * 
   * @param {*} event the icon which swaps visibility state of password chars. 
   */
  handleShowPw(event) {
    event.preventDefault();
    this.setState(state =>
      Object.assign({}, state, {
        showPw: !this.state.showPw
      }))
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
    // user: {
    //   username: "",
    //   email: "",
    //   password: "",
    //   // The second password entered to ensure spelling correctness.
    //   confirmpw: "",
    //   fullname: ""
    // },

    // axios.post(this.galleryUrl).then ((respondToGalleryUrl) => { this.setState ({characters: respondToGalleryUrl.data.data, characterGallery: {} }); }).catch(() => {});
    this.axios.post('/signup', {
      name: this.state.user.fullname,
      email: this.state.user.email,
      username: this.state.user.username,
      password: this.state.user.password,
      eventPrefs: []
    }).then(
      (respondToGalleryUrl) => {
        console.log(respondToGalleryUrl);
      }
        // this.setState({
        //   characters: respondToGalleryUrl.data.data, characterGallery: {} }); 
        // }
      ).catch((error) => {
        console.log("ERROR!", error);
      });


    // console.log("submitting...");
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
        email: this.state.user.email,
        fullname: this.state.user.fullname
      }
      this.submitSignupForm(user);
    }
    this.setState({
      errors: errors
    });
  }

  containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }

  render ()   // Here is the start of the render().
  {
    // Here we are returning the format of the List View.
    return (
      <div>
        <NavBar variant="blank" logoLink="/" />
        <SignupForm
          // Pass the state values and handler functions as parameters
          // to assign to each component.
          onSubmit={this.validateSignupForm}
          onChangeFullName={this.handleChangeFullName}
          onChangeUsername={this.handleChangeUsername}
          onChangeEmail={this.handleChangeEmail}
          onChangePw={this.handlePwChange}
          onShowPw={this.handleShowPw}
          onChangeConfirmPw={this.handleConfirmPwChange}
          errors={this.state.errors}
          user={this.state.user}
          pwVisibility={this.state.showPw}
        />
      </div>
    );
  }
}

export default SignupPage;