import React from "react";
import { TextField, Button, InputAdornment, IconButton, FormHelperText } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"
import '../scss/SignupPage.scss'
import NavButton from "./NavButton";
import SubmitButton from "./SubmitButton";

/**
 * SignupForm is not a component, but a function
 * that returns the react layout after assigning
 * the parameter values to the correct react
 * component. This is simply a way to make the
 * code more segmented and readable.
 */
const SignupForm = ({
    onSubmit,
    onChangeFullName,
    onChangeUsername,
    onChangeEmail,
    onChangePw,
    onShowPw,
    onChangeConfirmPw,
    errors,
    user,
    pwCheck,
    pwVisibility
}) => {
    // console.log(pwCheck.correctLen);
    return (
        <div>
            <form onSubmit={onSubmit} className="formSignup">
                <h1>SIGN UP</h1>
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
                <div className="component emailDiv">
                    <TextField 
                        variant="standard"
                        fullWidth={true}
                        className="input"
                        name="email"
                        label="Email"
                        value={user.email}
                        onChange={onChangeEmail}
                        error={errors.email ? true : false}
                        helperText={errors.email}
                    />
                </div>
                <div className="component passwordDiv">
                    <TextField
                        variant="standard"
                        fullWidth={true}
                        // "password" will have astricks, "input" will not
                        type={pwVisibility ? "input" : "password"}
                        // className="input password"
                        name="password"
                        label="Password"
                        value={user.password}
                        onChange={onChangePw}
                        error={errors.password ? true : false}
                        helperText={errors.password}
                        // Adds an icon at the end of the TextField to toggle visibility
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={onShowPw}
                                    >
                                        {pwVisibility ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <div className="component confirmPwDiv">
                    <TextField 
                        type="password"
                        variant="standard"
                        fullWidth={true}
                        // className="input confirm"
                        name="confirmpw"
                        label="Confirm Password"
                        value={user.confirmpw}
                        onChange={onChangeConfirmPw}
                        error={errors.confirmpw ? true : false}
                        helperText={errors.confirmpw}
                    />
                </div>
                <div className="component submitDiv">
                    <SubmitButton variant="small" text="SUBMIT" />
                    {/* <Button type="submit" className="buttonSubmit">Submit</Button> */}
                </div>
            </form>
        </div>
    );
}

export default SignupForm;