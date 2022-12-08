import React, { useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerF, InfoWindowF } from '@react-google-maps/api';
import NavBar from "./NavBar.js"
import "../scss/MapPage.scss"
import { List, ListItemButton } from '@mui/material';
import { ListItem } from '@mui/material';
import GreyBox from "../assets/grey_box.png"
import { ListItemText, Rating } from '@mui/material';
import DetailedInformationPage from './DetailedInformationPage.js';
import { getUserId, setUserId } from './userId.js';
import {Link} from "react-router-dom"
import axios from 'axios';
import { getToken } from './token.js';

/**
 * Explanation of implementation:
 * https://github.com/leighhalliday/google-maps-react-demo/tree/master/src
 */

const containerStyle = {
  width: "100%",//window.innerWidth,
  height: "100%"//window.innerHeight - 48
};

const default_center = [
  /*lat:*/ 40.102824,
  /*lng:*/ -88.227207
];

const default_zoom = 11;

export default class MapPage extends React.Component {
  // static contextType = GlobalContext;

  constructor(props) {
    super(props);

    this.axios = axios.create({baseURL: 'http://localhost:4000/api', timeout: 3000});
    this.axios.defaults.headers.common['Authorization'] =
         'Bearer ' + getToken();
    
    this.state = {
      userId: null,
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
      selectedEvent: {},
      mapref: null,
      centerLoc: default_center,
      zoomLevel: default_zoom,
      venuesUpdateTimeoutId: null
    };

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.venueFilter = this.venueFilter.bind(this);
    this.listItemOnClick = this.listItemOnClick.bind(this);
    this.keydownListener = this.keydownListener.bind(this);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
    // this.handleOnZoomChange = this.handleOnZoomChange.bind(this);
    // this.setTimeoutForApiUpdate = this.setTimeoutForApiUpdate.bind(this);
    // this.timeoutResponse = this.timeoutResponse.bind(this);
    this.updateApiVenues = this.updateApiVenues.bind(this);
  }

  keydownListener(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      this.setState({
        selectedEvent: {},
        selectedMarker: null
      })
      return false;
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keydownListener, false);

    let userId = getUserId();
    console.log("USER ID", userId);
    // 40.102824,
    // lng: -88.227207
    this.axios.get(`/map?latlong=40.102824,-88.227207&radius=10000&size=50&sort=relevance,desc`, {//latlong=-88.227207,40.102824', {
      // _id: getUserId()
      // longitude: ,
      // latitude: 
    }).then(
      (response) => {
        console.log(response);

        let data = response.data.data

        if (!response) {
          return;
        } else {
          let venues = [];
          
          for (let i = 0; i < data.length; i++) {
            let location = data[i].location;
            venues.push({
              id: data[i].id,
              name: data[i].name,
              location: [Number(location.latitude), Number(location.longitude)]
            });
          }
          console.log("VENUES:", venues);
          // "id": 54561366,
          // "name": "Staple's Center",
          // "location": [40.109831, -88.230371],
          // "event_ids": [52549859, 38144578, 37443701],
          // "review_ids": [84795708, 14119201, 83081087],
          // "rating_avg": 3.466
          
          this.setState({
            venues: venues
          });
        }
      }
      ).catch((error) => {
        console.log("ERROR!", error);
        this.setState({
          errors: {
            message: "map error"
          }
        });
      })
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydownListener, false);
  }

  venueFilter(event) {
    if (!event || !event.venue_id) return false
    return event.venue_id === this.state.selectedMarker;
  }

  onMarkerClick(id) {
    this.setSelectedMarker(id);
  }

  updateApiVenues() {
    let userId = getUserId();
    console.log("USER ID", userId);
    this.axios.get(`/map?latlong=${this.state.mapref.getCenter().lat()},${this.state.mapref.getCenter().lng()}&radius=100&size=50&sort=relevance,desc`, {
    }).then(
      (response) => {
        console.log(response);

        let data = response.data.data

        if (!response) {
          return;
        } else {
          let venues = [];
          
          for (let i = 0; i < data.length; i++) {
            let location = data[i].location;
            venues.push({
              id: data[i].id,
              name: data[i].name,
              location: [Number(location.latitude), Number(location.longitude)]
            });
          }
          console.log("VENUES:", venues);
          
          this.setState({
            venues: venues
          });
        }
    }).catch((error) => {
      console.log("ERROR!", error);
      this.setState({
        errors: {
          message: "map error"
        }
      });
    })
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
      selectedMarker: id,
      selectedEvent: {}
    }, () => {return this.updateSelectedMarkerVenueInfo()})
  }

  listItemOnClick(id) {
    this.setState({
      selectedEvent: this.state.selectedVenueEvents.find((element) => {
        return element.id === id;
      })
    });
  }

  onMapLoad(map) {
    this.setState({
      mapref: map
    })
  }

  handleOnDragEnd() {
    // if (this.state.mapref) {
    //   const latlng = [this.state.mapref.getCenter().lat(), this.state.mapref.getCenter().lng()];
    //   // this.setState({
    //   //   centerLoc: latlng
    //   // })
    // }
    // this.setTimeoutForApiUpdate();
    this.updateApiVenues();
  }

  // timeoutResponse() {
  //   console.log("update");
  //   // this.setState({
  //   //   venuesUpdateTimeoutId: null
  //   // });
  //   // this.updateSelectedMarkerVenueInfo();
  // }

  // setTimeoutForApiUpdate() {
  //   if (this.state.venuesUpdateTimeoutId) {
  //     clearTimeout(this.state.venuesUpdateTimeoutId);
  //   }
  //   const tempId = setTimeout(this.timeoutResponse, 1000);
  //   // this.setState({
  //   //   venuesUpdateTimeoutId: tempId
  //   // });
  // }

  // handleOnZoomChange() {
  //   if (this.state.mapref) {
  //     console.log(this.state.mapref.getZoom());
  //     // this.setState({
  //     //   zoomLevel: this.state.mapref.getZoom()
  //     // });
  //   }
  //   this.setTimeoutForApiUpdate();
  // }

  render() {
    // console.log(this.state.selectedMarker);
    return (
      <div>
        <NavBar variant="map"></NavBar>
        <div className='mapContainerDiv'>
        <LoadScript googleMapsApiKey="AIzaSyBwrwXQZRX_inRPmoN4xzOJDZ3tHrcY7Mc">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{"lat": default_center[0], "lng": default_center[1]}}
            zoom={default_zoom}
            options={{streetViewControl: false}}
            onLoad={this.onMapLoad}
            onDragEnd={this.handleOnDragEnd}
            // onZoomChanged={this.handleOnZoomChange}
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
                                <Link to={"/AddReviewPage?venue_info=" + JSON.stringify(this.state.selectedVenueInfo)}>Add Review</Link>
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
            venue={this.state.selectedVenueInfo}
            /></div> : <></>
        }
        </div>
      </div>
    );
  }
}