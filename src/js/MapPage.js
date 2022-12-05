import React, { useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import NavBar from "./NavBar.js"
import "../scss/MapPage.scss"

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
      selectedEvent: null
    }

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
        if (!json || !json["events"]) {
          console.log("No json events");
          return;
        }
        this.setState({
          events: json["events"]
        })
        console.log(json["events"]);
      }
    ).catch(
      (error) => console.log(error)
    );
  }

  render() {
    return (
      <div>
        <LoadScript
          googleMapsApiKey="AIzaSyBwrwXQZRX_inRPmoN4xzOJDZ3tHrcY7Mc"
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            // defaultOptions={{styles: mapStyles}}
          >
            {
              this.state.events ? this.state.events?.map(
                (marker) => {
                  console.log("marker");
                    try {
                      // console.log(marker.title);
                      const mar = <Marker title={marker.title} label={String(this.id)} key={marker.id} position={{lat: marker.location[0], lng: marker.location[1]}} />
                      console.log(mar);
                      return mar
                    } catch (error) {
                      console.log("error", error);
                      return <></>;
                    }
                }
            ) : <></>
            }
            {
              // Add info windows
            }
          </GoogleMap>
        </LoadScript>
      </div>
    );
  }
}

// export default class Map extends React.Component {
//   constructor(props) {
//     super(props);
//     // this.mounted = false;
//     // // Timeout for waiting for our server to response for markers initially
//     // this.creationTime = Date.now();
//     // this.id = Math.floor(Math.random()*10000);
//     // this.mount_timeout = 3000; // ms
//     // console.log("Creation",this.creationTime);
//     // console.log("id", this.id);
//     // this.state = {
//     //   events: {}
//     // }

//     // fetch(
//     //   // Get the test data
//     //   "http://localhost:3000/test_events.JSON"
//     // ).then(
//     //   (response) => response.json()
//     // ).then(
//     //   (json) => {
//     //     console.log(json);
//     //     this.jsonResponse(json);
//     //     // Todo: need to cach results
//     //   }
//     // ).catch(
//     //   (error) => console.log(error)
//     // );
//   }

//   componentDidMount() {
//     this.mounted = true;
//     console.log("just mounted!", this.id);
//   }

//   componentWillUnmount() {
//     this.mounted = false;
//     console.log("just unmounted!", this.id);
//   }
  

//   /**
//    * Designed to update the components state with the json array
//    * 
//    * @param {*} json 
//    */
//   jsonResponse(json) {
//     if (Date.now() - this.creationTime > this.mount_timeout) {
//       console.log("Timeout!", this.id);
//       return;
//     }
    
//     if (!this.mounted) {
//       // Set callback to recall this function because component still not mounted
//       console.log("setting callback", this.id);
//       setTimeout(this.jsonResponse.bind(this, json), 100);
//       return;
//     }

//     if (!json["events"]) {
//       console.log("No json events", this.id);
//       return;
//     }
//     this.setState({
//       events: json["events"]
//     })
//   }

//   render() {
//     return (
//       <div>
//         <NavBar className="navBar" variant="map"/>
//         <div className="mapWrapper">
//           <LoadScript
//               googleMapsApiKey="AIzaSyBwrwXQZRX_inRPmoN4xzOJDZ3tHrcY7Mc"
//             >
//               <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={center}
//                 zoom={10}
//               >
//                 { /* Child components, such as markers, info windows, etc. */ }
//                 {
//                   this.state.events.length ? this.state.events?.map(
//                           (marker) => {
//                             console.log("marker");
//                               try {
//                                 console.log(marker.title);
//                                 const mar = <Marker title={marker.title} label={String(this.id)} key={marker.id} position={{lat: marker.location[0], lng: marker.location[1]}} />
//                                 console.log(mar);
//                                 return mar
//                               } catch (error) {
//                                 console.log("error", error);
//                                 return <></>;
//                               }
//                           }
//                       ) : <></>
//                 }
//                 <Marker></Marker>
//                 <></>
//               </GoogleMap>
//             </LoadScript>
//         </div>
//       </div>
//     )
//   }
// }
          