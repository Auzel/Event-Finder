// Here we are importing all the required items.
import React from 'react';
import AddReviewForm from './AddReviewForm';
import NavBar from "./NavBar.js"
import dayjs from 'dayjs';
import { getUserId } from './userId';
import PropTypes from "prop-types";
import { ContactPageOutlined } from '@mui/icons-material';
import axios from 'axios';
import { getToken } from './token';

const validator = require("validator");

export default class AddReviewPage extends React.Component  
{
  constructor(props) {
    super(props);
    // console.log("PROPS:", props);

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
    const venue_info = JSON.parse(queryParameters.get("venue_info"));

    // console.log("VENUE INFO", venue_info);

    // State contains any mutable value in the form
    this.state = {
      // Contains error messages for specific components.
      // Specify component by setting the key to that component
      // name and the value to the error message to display.
      errors: {},
      venue: venue_info,
      // venue_id: {},
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

  componentDidMount() {
    
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
    // console.log("NEW DATE:", newDate.format("MM-DD-YY"));
    // console.log()
    this.setState({
      review: review
    })
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
    // console.log("submitting...", review);
    // this.axios.post('/reviews', {
    //   token: JSON.stringify(getToken()),
    //   user_id: JSON.stringify(getUserId()),
    //   venue_id: JSON.stringify(this.state.venue.id),
    //   rating: JSON.stringify(this.state.review.rating),
    //   long_comment: JSON.stringify(this.state.review.description),
    //   eventAttendedName: JSON.stringify(this.state.review.title),
    //   eventAttendedDate: JSON.stringify(this.state.review.date.format("MM-DD-YY"))

    this.axios.post('/reviews', {
      user_id: (getUserId()),
      venue_id: (this.state.venue.id),
      rating: (this.state.review.rating),
      short_comment: "",
      long_comment: (this.state.review.description),
      eventAttendedName: (this.state.review.title),
      eventAttendedDate: (this.state.review.date.format("MM-DD-YY"))
    }).then(
      (response) => {
        // console.log("RESPONSE", response);
        // let user = JSON.parse(response).data.data.user;
        // window.location("https://localhost:3000/accountinformation?" + JSON.stringify(user));
        window.location = "https://nickwinkler.web.illinois.edu/map";
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
      // console.log("no errors");
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

AddReviewPage.propTypes = {
  // venue_info: PropTypes.object.isRequired
}