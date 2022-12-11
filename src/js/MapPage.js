import React from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF, Marker } from '@react-google-maps/api';
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
import dayjs from 'dayjs';
import { ArrowRight, ContentCutOutlined } from '@mui/icons-material';

const containerStyle = {
  width: "100%",
  height: "100%"
};

const default_center = [
  /*lat:*/ 40.102824,
  /*lng:*/ -88.227207
];

const default_zoom = 11;

export default class MapPage extends React.Component {
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
      userId: null,
      venues: [],
      selectedMarker: null,
      // Variable set to true when list item button pushed and we should scroll to it AFTER next update
      selectedVenueInfo: {},
      loadingData: false,
      selectedVenueEvents: [],
      selectedEvent: {},
      mapref: null,
      centerLoc: default_center,
      zoomLevel: default_zoom,
      venuesUpdateTimeoutId: null
    };

    this.center = default_center;

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.venueFilter = this.venueFilter.bind(this);
    this.listItemOnClick = this.listItemOnClick.bind(this);
    this.keydownListener = this.keydownListener.bind(this);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.handleOnZoomChange = this.handleOnZoomChange.bind(this);
    this.updateApiVenues = this.updateApiVenues.bind(this);
    this.onCenterChanged = this.onCenterChanged.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
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
    this.updateApiVenues();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydownListener, false);
  }

  venueFilter(event) {
    if (!event || !event.venue_id) return false
    return event.venue_id === this.state.selectedMarker;
  }

  onMarkerClick(id) {
    // console.log("marked click");
    this.setSelectedMarker(id);
  }

  getRadius(zl) {
    return Math.ceil(88151*Math.exp(-0.683*zl) / 2);
  }

  updateApiVenues() {
    console.log(this.getRadius(this.state.zoomLevel));
    let userId = getUserId();
    console.log("USER ID", userId);
    this.setState({loadingData: true, selectedEvent: {}, selectedVenueEvents: [], selectedMarker: null});
    this.axios.get(`/map?latlong=${this.center[0]},${this.center[1]}&radius=${Math.min(this.getRadius(this.state.zoomLevel), 1000)}&size=50&sort=relevance,desc`, {
    }).then(
      (response) => {
        this.setState({loadingData: false});
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

          if (this.state.venues === venues) {
            console.log("List equal!");
            return;
          }
          
          this.setState({
            venues: venues
          });
        }
    }).catch((error) => {
      console.log("ERROR!", error);
      this.setState({
        errors: {
          message: "map error"
        },
        loadingData: true
      });
    })
  }

  updateSelectedMarkerVenueInfo() {
    // Dedicated method for markerclick so we can call axios and load the venue
    // in the background while infowindow is being created
    if (!this.state.selectedMarker) return;
    let userId = getUserId();
    // console.log("USER ID", userId);
    console.log("GETTING EVENTS");
    this.setState({loadingData: true});
    this.axios.get(`/venues/${this.state.selectedMarker}`, {
    }).then(
      (response) => {
        this.setState({loadingData: false});
        if (response.data && response.data.data) {
          console.log(response.data.data[0]);
          this.setState({selectedVenueInfo: response.data.data[0]});
        }
        console.log("BASE RESPONSE",response);
        const event_ids = response.data.data[0].event_ids;
        if (event_ids.length <= 0) {
          this.setState({
            selectedVenueEvents: []
          })
          return;
        }

        // console.log("EVENT IDS",event_ids);

        let param_string = "";
        for (var i = 0; i < event_ids.length; i++) {
          param_string += `${event_ids[i]},`;
        }
        
        // console.log(param_string.substring(0, param_string.length - 1));
        this.setState({loadingData: true});
        this.axios.get(`/events?id=${param_string}`, {}).then(
          (res) => {
            this.setState({loadingData: false});
            let event_info = res.data.data;
            for (let i = 0; i < event_info.length; i++) {
              const arr = event_info[i].datetime.split(/-|\s|:/);
              const r_date = dayjs(new Date(arr[0], arr[1] -1, arr[2], arr[3], arr[4], arr[5]));
              event_info[i].datetime = r_date;//.format("ddd MMM D YYYY [@] h:mm a [GMT]Z");
            }
            let sorted = event_info.sort((a, b) => (a.datetime.isAfter(b.datetime) ? 1 : -1));
            // console.log("SORTED", sorted);
            // console.log(res);
            // let event_info = res.data.data;
            // let formatted_event_info = event_info.map((event) => {
            //   console.log(event);
              
            //   // // formatted_event_info
            //   // event.datetime = r_date;
            //   // return event;
            // });
            this.setState({
              selectedVenueEvents: sorted
            })
          }
        ).catch((error) => {
          console.log("ERROR", error);
          this.setState({loadingData: false});
        });
    }).catch((error) => {
      console.log("ERROR!", error);
      this.setState({
        errors: {
          message: "map error"
        },
        loadingData: false
      });
    })
  }

  /**
   * Update the state of this component with the id of the marker clicked
   * 
   * @param {*} id 
   */
  setSelectedMarker(id) {
    console.log("set selected marker");
    this.setState({
      selectedMarker: id,
      selectedEvent: {},
      selectedVenueEvents: []
    }, () => {console.log("Callback"); return this.updateSelectedMarkerVenueInfo()})
  }

  listItemOnClick(event) {
    this.setState({
      selectedEvent: event
    });
  }

  createCenterControl(map) {
    const controlButton = document.createElement("button");

    controlButton.className = "controlButton";  
    controlButton.textContent = "Search Here";
    controlButton.title = "Click to reload venue search results";
    controlButton.type = "button";

    // Setup the click event listeners: simply set the map to Chicago.
    controlButton.addEventListener("click", () => {
      this.updateApiVenues();
    });
  
    return controlButton;
  }

  onMapLoad(map) {
    this.setState({
      mapref: map
    })
    // Create the DIV to hold the control.
    const centerControlDiv = document.createElement("div");
    // Create the control.
    const centerControl = this.createCenterControl(map);
    // Append the control to the DIV.
    centerControlDiv.appendChild(centerControl);
    map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
  }

  handleOnZoomChange() {
    if (this.state.mapref) {
      console.log(this.state.mapref.getZoom());
      this.setState({
        zoomLevel: this.state.mapref.getZoom(),
        selectedEvent: {},
        selectedMarker: null,
        selectedVenueEvents: []
      });
    }
  }

  onCenterChanged() {
    // console.log("CENTER CHANGED");
    if (this.state.mapref) {
      const latlng = [this.state.mapref.getCenter().lat(), this.state.mapref.getCenter().lng()];
      this.center = latlng;
    }
  }

  componentDidUpdate() {

  }

  render() {
    // console.log("selected marker:", this.state.selectedMarker);
    // console.log("venues:", this.state.venues);
    // Object.keys(this.state.selectedVenueInfo).length >  ? console.log("review:", )
    // Object.keys(this.state.selectedVenueInfo).length > 0 ? console.log(this.state.selectedVenueInfo.rating_avg) : <></>;
    // console.log(this.state);
    // console.log(this.state.selectedMarker,Object.keys(this.state.selectedEvent),Object.keys(this.state.selectedVenueInfo));
    return (
      <div>
        <NavBar variant="map" loadingIcon={this.state.loadingData}></NavBar>
        <div className='mapAndButton'>
        
        <div className='mapContainerDiv'>
        <LoadScript googleMapsApiKey="AIzaSyBwrwXQZRX_inRPmoN4xzOJDZ3tHrcY7Mc">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{lat: this.center[0], lng: this.center[1]}}
            zoom={default_zoom}
            options={{streetViewControl: false, scrollwheel: false, minZoom: 4}}
            onLoad={this.onMapLoad}
            onCenterChanged={this.onCenterChanged}
            onZoomChanged={this.handleOnZoomChange}
            
            // defaultOptions={{styles: mapStyles}}
            >
            {
              // Cycle through "events" in the state variable, creatinga  marker and info window
              // for each event. The infowindow is only visibile if state.selectedEvent is the id
              // of the marker.
              this.state.venues ? this.state.venues.map(
                (marker) => {
                  try {
                    // console.log("marker:", marker);
                    return (
                      <div>
                        <Marker
                          title={marker.title}
                          // label={String(this.id)}
                          key={marker.id}
                          position={{lat: marker.location[0], lng: marker.location[1]}}
                          onClick={() => {console.log(marker.id);this.onMarkerClick(marker.id)}} >
                        </Marker>
                        {
                          this.state.selectedMarker === marker.id ? (
                            <InfoWindowF 
                              position={{lat: marker.location[0], lng: marker.location[1]}} 
                              onCloseClick={() => this.setSelectedMarker(null)}
                              options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
                            >
                              <div className='eventPopUp'>
                                <h1 className="venueTitle">{marker.name}</h1>
                                <div className='ratingDiv'>
                                  <Rating readOnly precision={0.5} value={Object.keys(this.state.selectedVenueInfo).length > 0 ? this.state.selectedVenueInfo.avg_rating : 0}></Rating>
                                  <h3 className='numberReviews'>{Object.keys(this.state.selectedVenueInfo).length > 0 ? this.state.selectedVenueInfo.review_ids.length : 0} Reviews</h3>
                                  <Link className='addReviewLink' to={"/AddReviewPage?venue_info=" + JSON.stringify({id:this.state.selectedMarker})}>
                                    Add Review
                                  {/* <button className='addReviewButton'>Add Review</button> */}
                                </Link>
                                </div>
                               {/* <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}> */}
                               {
                                this.state.selectedVenueEvents && this.state.selectedVenueEvents.length > 0 ? 
                                <List style={{maxHeight: "300px", overflow: "auto"}}>
                                {
                                  this.state.selectedVenueEvents ? this.state.selectedVenueEvents.map(
                                    (event) => {
                                      // console.log("EVENT", event);
                                      return (
                                        <ListItem key={event.id} >
                                          <ListItemButton onClick={() => {this.listItemOnClick(event)}}>
                                            <div className='eventAlignmentDiv'>
                                              <div className='greyBoxImageDiv'>
                                                <img src={event.image ? event.image : GreyBox} className='greyBoxImage' alt="GI"/>
                                              </div>
                                              <div className='eventInfo'>
                                                <h3 id="eventName">{event.description}</h3>
                                                <br/>
                                                <h4>{(() =>{
                                                  // const arr = event.datetime.split(/-|\s|:/);
                                                  // return dayjs(new Date(arr[0], arr[1] -1, arr[2], arr[3], arr[4], arr[5])).format("ddd MMM D YYYY [@] h:mm a [GMT]Z");
                                                  return event.datetime.format("ddd MMM D YYYY [@] h:mm a [GMT]Z");
                                                })()}</h4>
                                                <h4 id="detailsText">Click for Details</h4>
                                              </div>
                                            </div>
                                          </ListItemButton>
                                        </ListItem>
                                      );
                                    }
                                  ) : <></>
                                } 
                                </List> 
                                : (this.state.loadingData ? 
                                  <h3 className="noEventsDiv">Loading Data...</h3>
                                  :
                                  <h3 className="noEventsDiv">No Events in the Next Week</h3>
                                  ) 
                               }
                              </div>
                            </InfoWindowF>
                          ) : <></>
                        }
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
        {this.state.selectedMarker && Object.keys(this.state.selectedEvent).length > 0 && Object.keys(this.state.selectedVenueInfo).length > 0 ? <div id='detailInfoDiv'>
          <DetailedInformationPage
            event={this.state.selectedEvent}
            venue={this.state.selectedVenueInfo}
            /></div> : <></>
        }
        </div>
        
        </div>
      </div>
    );
  }
}