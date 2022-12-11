// Here we are importing all the required items.
import React from 'react';
import NavBar from "./NavBar.js";
import "../scss/AccountInformation.scss";
import { Link } from 'react-router-dom';
import NavButton from './NavButton';
import axios from 'axios';
import { getToken } from './token.js';
import { getUserId } from './userId.js';
import { TextField } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { ThirtyFpsSelect } from '@mui/icons-material';
import ReviewCard from './ReviewCard.js';
// import axiosRetry from 'axios-retry';
// import getUserI

// Here we are creating a react class called App.
class AccountInformation extends React.Component  
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
      // It wasn't a server error, so reject like normal
      return Promise.reject(error);
    })
    
    this.state = {
      user: {
        name: "",
        email: "",
        username: "",
        eventPrefs: [],
        reviews: []
      },
      review_objs: [],
      loadingData: false
    }
  }

  componentDidMount() {

    // get user information and update the state
    this.setState({loadingData: true});
    this.axios.get('/users', {
      // retry: 3,
      _id: getUserId()
    }).then(
      (res) => {
        console.log(res);

        this.setState({loadingData: false});

        this.setState({
          user: {
            name: res.data.data.name,
            email: res.data.data.email,
            username: res.data.data.username,
            eventPrefs: res.data.data.eventPrefs,
            reviews: res.data.data.reviews
          }
        });

        /**
         * Here, the reviews list is cycled through and axios
         * requests are made to get the review information for
         * each id. The trick is, axios get requests are all
         * promises, so we can use Promise.all to handle the 
         * resposnse; that being where the values are set to
         * the state only when all requests are finished
         * */
        let review_objs = [];
        this.setState({loadingData: true});
        Promise.all(res.data.data.reviews.map((review) => {
          return this.axios.get(`/reviews/${review}`, {})
        })).then(
          (values) => {
            this.setState({loadingData: false});
            values.map((value) => {
              review_objs.push(value.data.data);
            })
            this.setState({
              review_objs: review_objs
            })
        });

        
      }).catch((error) => {
        this.setState({loadingData: false});
        console.log("ERROR!", error);
        this.setState({
          errors: {
            message: "Unable to acces the user"
          }
        });
      })
    }
 
  render ()   // Here is the start of the render().
  {
    // console.log(this.state.user);
    console.log(this.state.review_objs);
    // Here we are returning the format of the List View.
    return (
      <div>
        
        <NavBar variant="account" logoLink="/" />

        <div className="all">
          <div className="accountInformation">
            <h1> ACCOUNT INFORMATION </h1>
            {
              this.state.user.email ? 
              <div className='componentsFlexDiv'>
                <div className='fieldsAIContainer'>
                  <div className='fieldsAISubContainer'>
                    <h3 className='fieldAILabel'>Full Name:</h3>
                    <p className='fieldAI'>{this.state.user.name}</p>
                  </div>
                  <div className='fieldsAISubContainer'>
                    <h3 className='fieldAILabel'>Username:</h3>
                    <p className='fieldAI'>{this.state.user.username}</p>
                  </div>
                  <div className='fieldsAISubContainer'>
                    <h3 className='fieldAILabel'>Email:</h3>
                    <p className='fieldAI'>{this.state.user.email}</p>
                  </div>
                </div>
                <div className="linkAI">
                  {this.state.user.email ? 
                    <Link to = {"/EditAccountPage?user=" + JSON.stringify(this.state.user)} className="editAccountPageLink">
                      <button className='editAccountButton'>EDIT ACCOUNT</button>
                    </Link> :
                  <></>
                  }
                </div>
              </div>
              :
              <div className='progressCircle'><CircularProgress /></div>
            }
            <h1>REVIEWS</h1>
            <div className='reviewsContainerDiv'>
              {
                this.state.review_objs.length > 0 ?
                this.state.review_objs.map((review) => {
                  return(
                    <ReviewCard review={review} user={this.state.user}/>
                  );
                })
                :
                (this.state.loadingData ? <div className='progressCircle'><CircularProgress /></div> : <h2>No Reviews Yet</h2>)
              }
            </div>
    
          </div>
        </div>
      </div>
    );
  }
}

export default AccountInformation;