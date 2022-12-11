// Here we are importing all the required items.
import React from 'react';
import EditAccountForm from './EditAccountForm';
import NavBar from "./NavBar.js"
import '../scss/AccountHistory.scss'
import axios from 'axios';
import { getToken } from './token';
import { getUserId } from './userId.js'

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

    this.axios = axios.create({baseURL: 'http://localhost:4000/api', timeout: 3000});
    this.axios.defaults.headers.common['Authorization'] =
         'Bearer ' + getToken();

    this.axios.interceptors.response.use(null, (error) => {
    // Intercept an error related to the server not accepting connection and rerun

      if (error.config && !error.response && error.code === "ERR_NETWORK") {
        console.log(`server connection error, repeating request`);
        return this.axios.request({
          timeout: 3000,
          method: error.config.method,
          url: error.config.url,
          params: error.config.params
        });
      }

      if (error.response && error.response.data && error.response.data.data && error.response.data.data === "Request failed with status code 429") {
        console.log(`server rate limiting`);
        return this.axios.request({
          timeout: 3000,
          method: error.config.method,
          url: error.config.url,
          params: error.config.params
        });
      }
      // It wasn't a server error, so reject like normal
      return Promise.reject(error);
    })

    const queryParameters = new URLSearchParams(window.location.search)
    const user = JSON.parse(queryParameters.get("user"));
    console.log(user);
    this.providedUser = user;

    // name: this.state.user.fullname,
    // email: this.state.user.email,
    // username: this.state.user.username,
    // password: this.state.user.password,
    // eventPrefs: []
    const def_user = {
      _id: getUserId(),
      username: "",
      email: user.email,
      fullname: "",
      eventPrefs: user.eventPrefs
    }
    if (user) {
      def_user.username = user.username;
      def_user.fullname = user.name;
    }
    // console.log("DEF USER", def_user);

    // State contains any mutable value in the form
    this.state = {
      // Contains error messages for specific components.
      // Specify component by setting the key to that component
      // name and the value to the error message to display.
      errors: {},
      // Contains the key/value pairs for inputed values.
      user: def_user
    }

    // bind the handlers to 'this'.
    this.handleChangeFullName = this.handleChangeFullName.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.submitEditAccountForm = this.submitEditAccountForm.bind(this);
    this.validateEditAccountForm = this.validateEditAccountForm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
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
  submitEditAccountForm(user) {
    console.log("GIVEN USER", user);
    this.axios.put('/users', {
      // _id: this.state.user._id,
      name: user.name,
      username: user.usr,
      // email: this.state.user.email,
      // eventPrefs: this.state.user.eventPrefs
    }).then(
      (response) => {
        console.log(response);
        // this.setState({
        //   name: response.data.data.u
        //   username:
        // })
        window.location = "http://localhost:3000/accountinformation";
      }
    ).catch((error) => {
      console.log("ERROR!", error);
    });
  }

    /**
   * Called imediately after the submit button is pressed. This function
   * cancels the default submit response and instead runs the function here
   * which validates the username, email, and password before running 
   * submitSignupForm.
   * 
   * @param {*} event the submit button
   */
  validateEditAccountForm(event) {
    event.preventDefault();
    let errors = this.state.errors;
    errors.message = "";
    
    let hasError = false;
    for (const [key, value] of Object.entries(errors)) {
      if (value != "") hasError = true;
    }

    let hasAllInfo = true;
    if (!this.state.user.username || this.state.user.username === "" ||
        !this.state.user.fullname || this.state.user.fullname === ""
    ) { hasAllInfo = false; }
    // for (const [key, value] of Object.entries(this.state.user)) {
    //   if (value == "") hasAllInfo = false;
    // }

    if (hasError || !hasAllInfo) {
      errors.message = "Please satisfy all requirements.";
    } else {
      console.log("no errors");
      // Actually submit the form
      var user = {
        usr: this.state.user.username,
        name: this.state.user.fullname
      }
      this.submitEditAccountForm(user);
    }
    this.setState({
      errors: errors
    });
  }

  handleCancel() {
    window.location = "https://localhost:3000/accountinformation/user?" + JSON.stringify(this.providedUser);
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
          onSubmit={this.validateEditAccountForm}
          onChangeFullName={this.handleChangeFullName}
          onChangeUsername={this.handleChangeUsername}
          onCancel={this.handleCancel}
          errors={this.state.errors}
          user={this.state.user}
        />
      </div>
    );
  }
}

export default EditAccountPage;