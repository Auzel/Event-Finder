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
// import getUserI

// Here we are creating a react class called App.
class AccountInformation extends React.Component  
{
  constructor(props) {
    super(props);

    this.axios = axios.create({baseURL: 'http://localhost:4000/api', timeout: 3000});
    this.axios.defaults.headers.common['Authorization'] =    
         'Bearer ' + getToken();
    
    this.state = {
      user: {
        name: "",
        email: "",
        username: "",
        eventPrefs: [],
        reviews: []
      },
      review_objs: []
    }
  }

  componentDidMount() {

    // get user information and update the state
    this.axios.get('/users', {
      _id: getUserId()
    }).then(
      (res) => {
        console.log(res);

        this.setState({
          user: {
            name: res.data.data.name,
            email: res.data.data.email,
            username: res.data.data.username,
            eventPrefs: res.data.data.eventPrefs,
            reviews: res.data.data.reviews
          }
        });

        let review_objs = [];
        if (res.data.data.reviews) {
          for (var i = 0; i < Math.min(res.data.data.reviews.length, 5); i++) {
            this.axios.get(`/reviews/${res.data.data.reviews[i]}`, {}).then((res) => {
              review_objs.push(res.data.data);
            }).catch((error) => {
              console.log(error);
            })
          }
        }

        this.setState({
          review_objs: review_objs
        })
      }).catch((error) => {
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
    console.log(this.state.user);
    // Here we are returning the format of the List View.
    return (
      <div>
        
        <NavBar variant="account" logoLink="/" />

        <div className="all">
        {/* <div className="sideBar">

          <div className="informationDiv">

            <Link to = "/AccountInformation" className = "AccountInformationLink"> Information </Link>

          </div>

          <div className="HistoryDiv">

            <Link to = "/AccountHistory" className = "AccountHistoryLink"> History </Link>

          </div>

        </div> */}

        <div className="accountInformation">
          <h1> ACCOUNT INFORMATION </h1>
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
          </div>

          <div className="fieldsAI">

            <p> Full Name: {this.state.user.name}</p>

            <br/>

            <p> Username: {this.state.user.username}</p>

            <br/>

            <p> Email: {this.state.user.email}</p>

          </div>

          <br/>
          <br/>

          <div className="linkAI">

            {Object.keys(this.state.user).length > 0 ? 
            <Link to = {"/EditAccountPage?user=" + JSON.stringify(this.state.user)} className="editAccountPageLink"> EDIT ACCOUNT </Link> :
            <></>
            }

          </div>

        </div>

        </div>

      </div>
    );
  }
}

export default AccountInformation;   // Here we are exporting the class called Gallery.