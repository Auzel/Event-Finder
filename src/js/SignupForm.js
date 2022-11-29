import React from "react";
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"
import '../scss/SignupPage.scss'

/**
 * SignupForm is not a component, but a function
 * that returns the react layout after assigning
 * the parameter values to the correct react
 * component. This is simply a way to make the
 * code more segmented and readable.
 */
const SignupForm = ({
    onSubmit,
    onChange,
    onChangePw,
    onShowPw,
    errors,
    user,
    pwVisibility
}) => {
    return (
        <div>
            <form onSubmit={onSubmit} className="formSignup">
                <h1>Sign Up</h1>
                {errors.message && <p className="errorsText">{errors.message}</p>}
                <div className="component usernameDiv">
                    <TextField
                        variant="standard"
                        fullWidth={true}
                        className="input"
                        name="username"
                        label="Username"
                        value={user.username}
                        onChange={onChange}
                        // error is whether it is in error state
                        error={errors.username}
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
                        onChange={onChange}
                        error={errors.email}
                        helperText={errors.email}
                    />
                </div>
                <div className="component passwordDiv">
                    <TextField
                        variant="standard"
                        fullWidth={true}
                        // className="input password"
                        name="password"
                        label="Password"
                        value={user.password}
                        onChange={onChangePw}
                        error={errors.password}
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
                        variant="standard"
                        fullWidth={true}
                        // className="input confirm"
                        name="confirmPw"
                        label="Confirm Password"
                        value={user.confirmpw}
                        onChange={onChange}
                        error={errors.confirmpw}
                        helperText={errors.confirmpw}
                    />
                </div>
                <div className="component submitDiv">
                    <Button type="submit" className="buttonSubmit">Submit</Button>
                </div>
            </form>
        </div>
    );
}

export default SignupForm;