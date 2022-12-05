import React from "react";
import { TextField, Button, InputAdornment, IconButton, FormHelperText } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"
import '../scss/EditAccountPage.scss'
import NavButton from "./NavButton";
import SubmitButton from "./SubmitButton";
import { Link } from 'react-router-dom';

/**
 * SignupForm is not a component, but a function
 * that returns the react layout after assigning
 * the parameter values to the correct react
 * component. This is simply a way to make the
 * code more segmented and readable.
 */
const EditAccountForm = ({
    onSubmit,
    onChangeFullName,
    onChangeUsername,
    errors,
    user,
}) => {
    // console.log(pwCheck.correctLen);
    return (
        <div>
            <form onSubmit={onSubmit} className="formEditAccount">
                <h1>EDIT ACCOUNT</h1>
                <FormHelperText error={errors.message ? true : false}>{errors.message}</FormHelperText>
                
                <div className="component fullNameDiv">
                    <TextField
                        variant="standard"
                        fullWidth={true}
                        className="input"
                        name="fullname"
                        label="Full Name"
                        value={user.fullname}
                        onChange={onChangeFullName}
                        // error is whether it is in error state
                        error={errors.fullname ? true : false}
                        // helperText is the text shown on error
                        helperText={errors.fullname}
                    />
                </div>

                <div className="component usernameDiv">
                    <TextField
                        variant="standard"
                        fullWidth={true}
                        className="input"
                        name="username"
                        label="Username"
                        value={user.username}
                        onChange={onChangeUsername}
                        // error is whether it is in error state
                        error={errors.username ? true : false}
                        // helperText is the text shown on error
                        helperText={errors.username}
                    />
                </div>

                <div className="component submitDiv">
                    <SubmitButton variant="small" text="SUBMIT" />
                
                    <Link to = "/AccountInformation" className="cancelLink"> <button className="cancelButton"> CANCEL</button> </Link>
                </div>
            </form>
        </div>
    );
}

export default EditAccountForm;