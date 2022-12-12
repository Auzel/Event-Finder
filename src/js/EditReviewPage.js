// Here we are importing all the required items.
import React from 'react';
import EditReviewForm from './EditReviewForm';
import NavBar from "./NavBar.js"
import dayjs from 'dayjs';
import axios from 'axios';
import { getToken } from './token.js';

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
export default class EditReviewPage extends React.Component  
{
  constructor(props) {
    super(props);

    this.axios = axios.create({baseURL: 'https://final-project-409.herokuapp.com/api', timeout: 3000});
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
    const review = JSON.parse(queryParameters.get("review"));
    // console.log(review);
    this.providedReview = review;
    

    // parse for date
    review.eventAttendedDate = dayjs(review.eventAttendedDate);
    review.rating = parseInt(review.rating);

    // console.log(review);

    // State contains any mutable value in the form
    this.state = {
      // Contains error messages for specific components.
      // Specify component by setting the key to that component
      // name and the value to the error message to display.
      errors: {},
      // Contains the key/value pairs for inputed values.
      review: review
    }

    // bind the handlers to 'this'.
    this.handleChangeRating = this.handleChangeRating.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.submitEditReviewForm = this.submitEditReviewForm.bind(this);
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
    review.eventAttendedDate = newDate;
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
   * @param {dictionary} review Key/value pairs for username, password, email
   * that will be submitted to the database.
   */
   submitEditReviewForm(review) {
    // console.log("submitting...");
    // console.log(review);
    this.axios.put(`/reviews/${review._id}`, {
      rating: review.rating,
      long_comment: review.long_comment,
      eventAttendedName: review.eventAttendedName,
      eventAttendedDate: review.eventAttendedDate
    }).then((res) => {
      // console.log(res);
      window.location = "https://nickwinkler.web.illinois.edu/accountinformation";
    }).catch((error) => {
      console.log("error", error);
    })
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
      if (value === "") hasAllInfo = false;
    }

    // console.log(hasError, hasAllInfo);

    if (hasError || !hasAllInfo) {
      errors.message = "Please satisfy all requirements.";
    } else {
      // console.log("no errors");
      // Actually submit the form
      // var review = {
      //   rating: this.state.review.rating,
      //   title: this.state.review.title,
      //   date: this.state.review.date,
      //   description: this.state.review.description
      // }
      this.submitEditReviewForm(this.state.review);
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
        <EditReviewForm
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