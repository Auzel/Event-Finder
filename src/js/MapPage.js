import React, { useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerF, InfoWindowF } from '@react-google-maps/api';
import NavBar from "./NavBar.js"
import "../scss/MapPage.scss"
import { List, ListItemButton } from '@mui/material';
import { ListItem } from '@mui/material';
import GreyBox from "../assets/grey_box.png"
import { ListItemText, Rating } from '@mui/material';
import DetailedInformationPage from './DetailedInformationPage.js';
import { TurnRight } from '@mui/icons-material';

/**
 * Explanation of implementation:
 * https://github.com/leighhalliday/google-maps-react-demo/tree/master/src
 */

const containerStyle = {
  width: "100vw",//window.innerWidth,
  height: "100vh"//window.innerHeight - 48
};

const center = {
  lat: 40.102824,
  lng: -88.227207
};

export default class MapPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      venues: [],
      selectedMarker: null,
      // Variable set to true when list item button pushed and we should scroll to it AFTER next update
      selectedVenueInfo: {
        "id": null, 
        "name": "",
        "location": [],
        "event_ids": [],
        "review_ids": [],
        "rating_avg": null
      },
      selectedVenueEvents: [],
      selectedEvent: {}
    }

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.venueFilter = this.venueFilter.bind(this);
    this.listItemOnClick = this.listItemOnClick.bind(this);

    // useEffect(() => {
    //   const listener = e => {
    //     if (e.key === "Escape") {
    //       this.setState({
    //         selectedEvent: null,
    //         events: null
    //       })
    //     }
    //   };
    //   window.addEventListener("keydown", listener);
  
    //   return () => {
    //     window.removeEventListener("keydown", listener);
    //   };
    // }, []);
  }

  componentDidMount() {
    fetch(
      // Get the test data
      "http://localhost:3000/test_events.JSON"
    ).then(
      (response) => response.json()
    ).then(
      (json) => {
        // console.log(json);
        if (!json || !json["venues"]) {
          console.log("No json venues");
          return;
        }
        this.setState({
          venues: json["venues"]
        })
      }
    ).catch(
      (error) => console.log(error)
    );
  }

  venueFilter(event) {
    if (!event || !event.venue_id) return false
    return event.venue_id === this.state.selectedMarker;
  }

  onMarkerClick(id) {
    this.setSelectedMarker(id);
  }

  updateSelectedMarkerVenueInfo() {
    // Dedicated method for markerclick so we can call axios and load the venue
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

  /**
   * Update the state of this component with the id of the marker clicked
   * 
   * @param {*} id 
   */
  setSelectedMarker(id) {
    this.setState({
      selectedMarker: id
    }, () => {return this.updateSelectedMarkerVenueInfo()})
  }

  listItemOnClick(id) {
    this.setState({
      selectedEvent: this.state.selectedVenueEvents.find((element) => {
        return element.id === id;
      })
    });
  }

  render() {
    console.log(this.state.selectedMarker);
    return (
      <div>
        <LoadScript googleMapsApiKey="AIzaSyBwrwXQZRX_inRPmoN4xzOJDZ3tHrcY7Mc">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            options={{streetViewControl: false}}
            // defaultOptions={{styles: mapStyles}}
            >
            {
              // Cycle through "events" in the state variable, creatinga  marker and info window
              // for each event. The infowindow is only visibile if state.selectedEvent is the id
              // of the marker.
              this.state.venues ? this.state.venues.map(
                (marker) => {
                  try {
                    return (
                      <div>
                        <MarkerF
                          title={marker.title}
                          // label={String(this.id)}
                          key={marker.id}
                          position={{lat: marker.location[0], lng: marker.location[1]}}
                          onClick={() => {this.onMarkerClick(marker.id)}} >
                        {
                          this.state.selectedMarker === marker.id ? (
                            <InfoWindowF onCloseClick={() => this.setSelectedMarker(null)}>
                              <div className='eventPopUp'>
                                <h2 className="venueTitle">{marker.name}</h2>
                                <Rating readOnly precision={0.5} value={this.state.selectedVenueInfo.rating_avg}></Rating>
                                {/* <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}> */}
                                  <List style={{maxHeight: "300px", overflow: "auto"}}>
                                  {
                                    this.state.selectedVenueEvents ? this.state.selectedVenueEvents.map(
                                      (event) => {
                                        // console.log("EVENT", event);
                                        return (
                                          <ListItem key={event.id} >
                                            <ListItemButton onClick={() => {this.listItemOnClick(event.id)}}>
                                              <img src={GreyBox} className='greyBoxImage' alt="GI"/>
                                              
                                            </ListItemButton>
                                          </ListItem>
                                        );
                                      }
                                    ) : <></>
                                  } 
                                  </List>                               
                              </div>
                            </InfoWindowF>                   
                          ) : null
                        }
                        </MarkerF>
                      </div>)
                  } catch (error) {
                    console.log("error", error);
                    return <></>;
                  }
                }
              ) : <></>
            }
          </GoogleMap>
        </LoadScript>
        {this.state.selectedMarker ? <div id='detailInfoDiv'>
          <DetailedInformationPage
            event={this.state.selectedEvent}
            /></div> : <></>
        }
      </div>
    );
  }
}