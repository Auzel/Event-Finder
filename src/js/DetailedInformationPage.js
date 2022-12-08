import React, {Component} from "react";
import PropTypes from "prop-types";
import GreyBox from "../assets/grey_box.png";
import "../scss/DetailedInformationPage.scss";

export default class DetailedInformationPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Where the axios response for reviews is stored
            reviews: []
        }
    }

    // Helper function to convert vh units to px units.
    vh_to_px(vh) {
        return document.documentElement.clientHeight * vh / 100;
    }

    componentDidUpdate() {
        window.scrollTo({top: this.vh_to_px(100), behavior: 'smooth'});

        // Call for the reviews information to be loaded. On load, it will call
        //  a callback function to update state with a list of reviews.
    }

    getReviews(data, memo={}) {
        // get axios information
        // callback a function that updates the state with the response

        // in the background while infowindow is being created
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
            if (!json || !json["events"]) {
                console.log("No json events");
                return;
            }
    
            // Get info for venue
            let selectedVenueInfo = {};
            try {
                for (var i = 0; i < json["venues"].length; i++) {
                let obj = json["venues"][i];
                if (obj.id === this.state.selectedMarker) {
                    let temp = {};
                    temp.id = obj.id;
                    temp.name = obj.name;
                    temp.location = obj.location;
                    temp.event_ids = obj.events_ids;
                    temp.review_ids = obj.review_ids;
                    temp.rating_avg = obj.rating_avg;
    
                    selectedVenueInfo = temp;
                }
                }
            } catch (error) {
                console.log("error getting venue info", error);
            }
    
    
            // Get events for venue
    
            // Cycle through the event id's attached to the selected venue marker
            // and add the data for each event in the state variable.
            let selectedVenueEvents = [];
            try {
                for (var i = 0; i < json["events"].length; i++) {
                let obj = json["events"][i];
                // console.log(i);
                if (obj.venue_id === this.state.selectedMarker) {
                    let temp = {};
                    temp.id = obj.id;
                    temp.title = obj.title;
                    temp.venue_id = obj.venue_id;
                    temp.date = obj.date;
                    temp.image = obj.image;
                    temp.description = obj.description;
    
                    selectedVenueEvents.push(temp);
                }
                }
            } catch (error) {
                console.log("error getting events", error);
            }
    
            // console.log("VENUE INFO", selectedVenueInfo);
            // console.log("VENUE EVENTS", selectedVenueEvents);
            this.setState({
                selectedVenueInfo: selectedVenueInfo,
                selectedVenueEvents: selectedVenueEvents
            })
            }
        ).catch(
            (error) => console.log(error)
        );
    }

    render() {
        let len = Object.keys(this.props.event).length;
        // console.log("Length:", len);
        if (len > 0) {
            console.log("EVENT:", this.props.event);
        }
        return (
            <div>
                {Object.keys(this.props.event).length > 0 ? 
                    <div id="detailMainDiv">
                        <img src={GreyBox} id="detailImg"></img>
                        <div id="detailInfoDiv">
                            <h2>{this.props.event.title}</h2>
                            <p className="detailSmallText">{this.props.event.date}</p>
                            <div id="detailRatingDiv">
                                Ratings
                            </div>
                            <p className="detailGeneralText">{this.props.event.description}</p>
                            <a>More</a>
                            <h3>Venue Reviews</h3>
                            <div className="reviewsMainDiv">
                                {/* Add the reviews here from a state list variable */}
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