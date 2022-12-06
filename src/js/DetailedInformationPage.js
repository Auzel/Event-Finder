import React, {Component} from "react";
import PropTypes from "prop-types";
import GreyBox from "../assets/grey_box.png";
import "../scss/DetailedInformationPage.scss";

export default class DetailedInformationPage extends Component {
    constructor(props) {
        super(props);
        console.log("DetailedInformationPage");
    }

    // Helper function to convert vh units to px units.
    vh_to_px(vh) {
        return document.documentElement.clientHeight * vh / 100;
    }

    componentDidUpdate() {
        window.scrollTo({top: this.vh_to_px(100), behavior: 'smooth'});
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
                    <div>
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
                                <div>Placeholder for reviews</div>
                            </div>
                        </div>
                    </div> : <></>
                }
            </div>
        )
    }
}

DetailedInformationPage.propTypes = {
    event: PropTypes.any
}