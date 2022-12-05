import React, {Component} from "react";

export default class DetailedInformationPage extends Component {
    constructor(props) {
        super(props);
        console.log("DetailedInformationPage");
    }

    componentDidMount() {
        this.props.mountCallBack();
    }

    render() {
        return (
            <div>
                Heyo
            </div>
        )
    }
}