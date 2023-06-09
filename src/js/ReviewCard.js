import "../scss/ReviewCard.scss"
import React from "react"
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { Rating } from "@mui/material";

export default class ReviewCard extends React.Component {
    constructor(props) {
        super(props);

        this.handleMoreButtonPressed = this.handleMoreButtonPressed.bind(this);
    }

    handleMoreButtonPressed(event) {

    }

    render() {
        return (
            <div className="mainDiv">
                {this.props.clickable ? <Link  className="linkComponent" to={`/editreviewpage?review=${JSON.stringify(this.props.review)}`}>
                    <div className="componentDiv">
                        <h3 className="ratingCardTitle">{this.props.review.eventAttendedName}</h3>
                        <div className="ratingCardDiv">
                            <Rating value={this.props.review.rating} size="small" precision={0.5} readOnly />
                            {this.props.showUsername ? <div className="reviewUsername">@{this.props.user.username}</div> : <></>}
                        </div>
                        {this.props.review.short_comment && this.props.review.short_comment != "" ? <h4>{this.props.review.short_comment}</h4> : <></>}
                        <p className="description">{this.props.review.long_comment}</p>
                    </div>
                </Link>
                : <div className="componentDiv">
                <h3 className="ratingCardTitle">{this.props.review.eventAttendedName}</h3>
                <div className="ratingCardDiv">
                    <Rating value={this.props.review.rating} size="small" precision={0.5} readOnly />
                    {this.props.showUsername ? <div className="reviewUsername">@{this.props.user.username}</div> : <></>}
                </div>
                {this.props.review.short_comment && this.props.review.short_comment != "" ? <h4>{this.props.review.short_comment}</h4> : <></>}
                <p className="description">{this.props.review.long_comment}</p>
            </div>}
            </div>
        )
    }
}

ReviewCard.propTypes = {
    user: PropTypes.object,
    showUsername: PropTypes.bool,
    clickable: PropTypes.bool
}

ReviewCard.defaultProps = {
    showUsername: true,
    clickable: true
}