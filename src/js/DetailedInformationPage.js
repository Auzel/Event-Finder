import React, {Component} from "react";
import PropTypes from "prop-types";
import GreyBox from "../assets/grey_box.png";
import "../scss/DetailedInformationPage.scss";
import axios from "axios";
import { getToken } from "./token";
import { getUserId } from "./userId";
import { List, ListItem, CircularProgress, Rating } from "@mui/material";
import ReviewCard from './ReviewCard.js';

export default class DetailedInformationPage extends Component {
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

        this.state = {
            // Where the axios response for reviews is stored
            reviews: [],
            loadingData: false
        }

        this.getReviews = this.getReviews.bind(this);
    }

    // Helper function to convert vh units to px units.
    vh_to_px(vh) {
        return document.documentElement.clientHeight * vh / 100;
    }

    componentDidMount() {
        // console.log("venue", this.props.venue);
        // console.log("event", this.props.event);
        this.getReviews();
    }

    componentDidUpdate() {
        window.scrollTo({top: this.vh_to_px(100) - 48, behavior: 'smooth'});

        // Call for the reviews information to be loaded. On load, it will call
        //  a callback function to update state with a list of reviews.
    }

    getReviews(data, memo={}) {
        // get axios information
        // callback a function that updates the state with the response
        if (!this.props.venue || !this.props.event) setTimeout(this.getReviews, 500);
        this.setState({loadingData: true});

        Promise.all(this.props.venue.review_ids.map((review) => {
          return this.axios.get(`/reviews/${review}`, {})
        })).then(
          (values) => {
            this.setState({loadingData: false});
            let review_objs = [];
            values.map((value) => {
              review_objs.push(value.data.data);
            });
            this.setState({
              reviews: review_objs.reverse()
            });
            // console.log(review_objs);
        }).catch((error) =>{
            this.setState({loadingData: false});
            // console.log(error);
        });
    }

    render() {
        let len = Object.keys(this.props.event).length;
        // console.log("Length:", len);
        if (len > 0) {
            // console.log("EVENT:", this.props.event);
        }
        return (
            <div>
                {Object.keys(this.props.event).length > 0 ? 
                    <div id="detailMainDiv">
                        <img src={this.props.event.image ? this.props.event.image : GreyBox} id="detailImg"></img>
                        <div id="detailInfoDiv">
                            <div id="eventInfoDetailDiv">
                                <h1 id="eventTitleDetailedID">{this.props.event.description}</h1>
                                <h2>@ {this.props.venue.name}</h2>
                                <p className="detailSmallText">{this.props.event.datetime.format("ddd MMM D YYYY [@] h:mm a [GMT]Z")}</p>
                                <div id="detailRatingDiv">
                                    <Rating readOnly precision={0.5} value={Object.keys(this.props.venue).length > 0 ? this.props.venue.avg_rating : 0}></Rating>
                                    <h3 className='numberReviews'>{Object.keys(this.props.venue).length > 0 ? this.props.venue.review_ids.length : 0} Reviews</h3>
                                </div>
                                <a href={this.props.event && this.props.event.link ? this.props.event.link : ""} className="ticketmasterLink">Purchase Tickets</a>
                                <br/>
                                <br/>
                            </div>
                            <div className="reviewsMainDiv">
                                {/* Add the reviews here from a state list variable */}
                                <h2 id="venueReviewsID">VENUE REVIEWS</h2>
                                <List>

                                
                                {/* <div className='reviewsContainerDiv'> */}
                                {
                                    this.state.reviews.length > 0 ?
                                    this.state.reviews.map((review) => {
                                    return(
                                        <ListItem key={review._id}>
                                            <ReviewCard clickable={false} review={review} showUsername={false}/>
                                        </ListItem>
                                    );
                                    })
                                    :
                                    (this.state.loadingData ? <div className='progressCircle'><CircularProgress /></div> : <h2 id="venueReviewsID">No Reviews Yet</h2>)
                                }
                                </List>
                                {/* </div> */}
                            </div>
                        </div>
                    </div> : <></>
                }
            </div>
        )
    }
}

DetailedInformationPage.propTypes = {
    event: PropTypes.object,
    venue: PropTypes.object
}