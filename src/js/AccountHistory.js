// Here we are importing all the required items.
import React from 'react';
import NavBar from "./NavBar.js";
import "../scss/AccountHistory.scss";
import { Link } from 'react-router-dom';
import axios from 'axios';
import {getUserId} from "./userId.js"
import {getToken} from "./token.js"
import { List, ListItem, ListItemButton, Rating } from '@mui/material';

// Here we are creating a react class called App.
class AccountHistory extends React.Component  
{
  constructor(props) {
    super(props);

    // Get the history information
    this.axios = axios.create({baseURL: 'http://localhost:4000/api', timeout: 3000});
    this.axios.defaults.headers.common['Authorization'] =
         'Bearer ' + getToken();

    this.state = {
      reviews: [],
      viewedEvent: []
    }
  }

  componentDidMount() {
    fetch(
      // Get the test data
      // When communicating with server, attached list of event id's for selected
      // venue as a parameter in this call.
      "http://localhost:3000/test_events.JSON"
    ).then(
        (response) => response.json()
    ).then(
      (json) => {
      // console.log(json);
      if (!json || !json["reviews"]) {
          console.log("No json reviews");
          return;
      }

      let reviews = [];
      const userId_string = getUserId().toString();
      for (var i = 0; i < json["reviews"].length; i++) {
        let obj = json["reviews"][i];
        if (obj.user_id === userId_string) {
          reviews.push(obj);
        }
      }

      console.log("REVIEWS:", reviews);

      this.setState({
        reviews: reviews
      })
    });
  }

  render ()   // Here is the start of the render().
  {
    // Here we are returning the format of the List View.
    return (
      <div>
        
        <NavBar variant="account" logoLink="/" />

        <div class="all">

          <div class="sideBar">

            <div class="informationDiv">

              <Link to = "/AccountInformation" className = "AccountInformationLink"> Information </Link>

            </div>

            <div class="HistoryDiv">

              <Link to = "/AccountHistory" className = "AccountHistoryLink"> History </Link>

            </div>

          </div>

          <div className="accountHistory">

            <div className="headingAH"> ACCOUNT HISTORY </div>

            <br/>
            <br/>

            <div className="reviews">

              <p className="reviewsText"> Reviews: </p>
              <div className='listViewDiv'>
                <List style={{maxHeight: "100%", overflow: "auto"}}>
                {
                  this.state.reviews.length > 0 ? this.state.reviews.map(
                    (review) => {
                      // console.log("EVENT", event);
                      return (
                        <ListItem key={review.id} >
                          <ListItemButton onClick={() => {this.listItemOnClick(review.id)}}>
                            <div className='reviewCard'>
                              <h2>{review.visited_event}</h2>
                              <Rating disabled value={review.rating} precision={0.5}></Rating>
                              <div className="dateText">{review.visited_event_date}</div>
                              <p className="descriptionText">{review.description}</p>
                            </div>
                            {/* <img src={GreyBox} className='greyBoxImage' alt="GI"/> */}
                          </ListItemButton>
                        </ListItem>
                      );
                    }
                  ) : <></>
                } 
                </List>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }
}

export default AccountHistory;   // Here we are exporting the class called Gallery.