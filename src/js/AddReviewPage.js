// Here we are importing all the required items.
import React from 'react';
import AddReviewForm from './AddReviewForm';
import NavBar from "./NavBar.js"
import dayjs from 'dayjs';

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
export default class AddReviewPage extends React.Component  
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
      review: {
        rating: "",
        title: "",
        date: dayjs(),
        description: ""
      },
    }

    // bind the handlers to 'this'.
    this.handleChangeRating = this.handleChangeRating.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.submitReviewForm = this.submitReviewForm.bind(this);
    this.validateReviewForm = this.validateReviewForm.bind(this);
  }

  // Write the handlers and functionality for everything.

  /**
   * Called when a TextField input is changed. Updates the state
   * to the given input.
   * 
   * @param {*} event the calling TextField
   */
   handleChangeRating(event) {
    // get the calling TextField
    const field = event.target.name;
    const review = this.state.review;
    review[field] = event.target.value;

    this.setState({
      review
    });
  }

  handleChangeTitle(event) {
    // get the calling TextField
    const field = event.target.name;
    const review = this.state.review;
    review[field] = event.target.value;

    this.setState({
      review
    });

    // // Validate the email
    // let errors = this.state.errors;
    // if (
    //   event.target.value &&
    //   !validator.isEmail(event.target.value)
    // ) {
    //   errors['email'] = "Please provide a correct email address.";
    // } else {
    //   errors['email'] = "";
    // }

    // this.setState({
    //   errors: errors
    // })
  }

  /**
   * Called when the password TextField input value is changed. Updates
   * the state of the password to the inputted value, but also updates
   * state values that are used in the component to show password criteria.
   * 
   * @param {*} event the calling TextField (should be the password)
   */
   handleChangeDate(newDate) {
    // console.log(event);
    let review = this.state.review;
    review.date = newDate;
    this.setState({
      review: review
    })

    // const field = event.target.name;
    // const review = this.state.review;
    // review[field] = event.target.value;

    // this.setState({
    //   review
    // });

    // // Validate the password and update the state for radio icons accordingly
    // let isempty = event.target.value ? false : true;
    // let hasSpecialChar = this.containsSpecialChars(event.target.value);
    // let hasCorrectLen = (event.target.value && event.target.value.length >= 8) ? true : false;

    // let errors = this.state.errors;
    // if (isempty) {
    //   errors.password = "";
    // } else if (!hasSpecialChar && !hasCorrectLen) {
    //   errors.password = "Password must be greater than 8 characters and contain one special character.";
    // } else if (!hasSpecialChar) {
    //   errors.password = "Password must contain one special character.";
    // } else if (!hasCorrectLen) {
    //   errors.password = "Password must be greater than 8 characters.";
    // } else {
    //   errors.password = ""
    // }

    // this.setState({
    //   errors: errors
    // })
  }

  /**
   * Changes the state of password visibility to the opposite.
   * 
   * @param {*} event the icon which swaps visibility state of password chars. 
   */
   handleChangeDescription(event) {
    const field = event.target.name;
    const review = this.state.review;
    review[field] = event.target.value;

    this.setState({
      review
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
  submitReviewForm(review) {
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
   validateReviewForm(event) {
    event.preventDefault();
    let errors = this.state.errors;
    errors.message = "";
    
    let hasError = false;
    for (const [key, value] of Object.entries(errors)) {
      if (value != "") hasError = true;
    }

    let hasAllInfo = true;
    for (const [key, value] of Object.entries(this.state.review)) {
      if (value == "") hasAllInfo = false;
    }

    if (hasError || !hasAllInfo) {
      errors.message = "Please satisfy all requirements.";
    } else {
      console.log("no errors");
      // Actually submit the form
      var review = {
        rating: this.state.review.rating,
        title: this.state.review.title,
        date: this.state.review.date,
        description: this.state.review.description
      }
      this.submitReviewForm(review);
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
        <AddReviewForm
          // Pass the state values and handler functions as parameters
          // to assign to each component.
          onSubmit={this.validateReviewForm}
          onChangeRating={this.handleChangeRating}
          onChangeTitle={this.handleChangeTitle}
          onChangeDate={this.handleChangeDate}
          onChangeDescription={this.handleChangeDescription}
          errors={this.state.errors}
          review={this.state.review}
        />
      </div>
    );
  }
}