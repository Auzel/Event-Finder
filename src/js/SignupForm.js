import React from "react";
const axios = require("axios");

class SignupForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            user: {
                username: "",
                email: "",
                password: ""
            }
        }
    }
}