import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import NavBar from "./NavBar.js"
import "../scss/MapPage.scss"

const containerStyle = {
  width: "100%",//window.innerWidth,
  height: "100%"//window.innerHeight - 48
};

const center = {
  lat: 40.102824,
  lng: -88.227207
};

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.mounted = false;
    // Timeout for waiting for our server to response for markers initially
    this.creationTime = Date.now();
    this.mount_timeout = 1000; // ms
    console.log("Creation",this.creationTime);
    this.state = {
      events: {}
    }

    fetch(
      // Get the test data
      "http://localhost:3000/test_events.JSON"
    ).then(
      (response) => response.json()
    ).then(
      (json) => {
        console.log(json);
        this.jsonResponse(json);
        // Todo: need to cach results
      }
    ).catch(
      (error) => console.log(error)
    );
  }

  componentDidMount() {
    this.mounted = true;
    console.log("just mounted!");
  }

  componentDidUnmount() {
    this.mounted = false;
    console.log("just unmounted!");
  }
  

  /**
   * Designed to update the components state with the json array
   * 
   * @param {*} json 
   */
  jsonResponse(json) {
    if (Date.now() - this.creationTime > this.mount_timeout) {
      console.log("Timeout!");
      return;
    }
    
    if (!this.mounted) {
      // Set callback to recall this function because component still not mounted
      console.log("setting callback");
      setTimeout(this.jsonResponse.bind(this, json), 100);
      return;
    }

    if (!json["events"]) {
      console.log("No json events");
      return;
    }
    this.setState({
      events: json["events"]
    })
  }

  render() {
    return (
      <div>
        <NavBar className="navBar" variant="map"/>
        <div className="mapWrapper">
          <LoadScript
              googleMapsApiKey="AIzaSyBwrwXQZRX_inRPmoN4xzOJDZ3tHrcY7Mc"
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
              >
                { /* Child components, such as markers, info windows, etc. */ }
                {
                  this.state.events.length ? this.state.events.map(
                          (marker) => {
                            console.log("marker");
                              try {
                                return <Marker key={marker.id} position={{lat: marker.location[0], lng: marker.location[1]}} />
                              } catch (error) {
                                console.log(error);
                                return <></>;
                              }
                          }
                      ) : <></>
                }
                <Marker></Marker>
                <></>
              </GoogleMap>
            </LoadScript>
        </div>
      </div>
    )
  }
}
          