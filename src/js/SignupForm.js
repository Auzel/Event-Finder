import React from "react";
import { TextField, Button, Box, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"

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
            <Box component="form" onSubmit={onSubmit}>
                <h1>Sign Up</h1>
                {errors.message && <p className="errorsText">{errors.message}</p>}
                <TextField
                    name="username"
                    
                    label="Username"
                    value={user.username}
                    onChange={onChange}
                    // error is whether it is in error state
                    error={errors.username}
                    // helperText is the text shown on error
                    helperText={errors.username}
                />
                <TextField 
                    name="email"
                    label="Email"
                    value={user.email}
                    onChange={onChange}
                    error={errors.email}
                    helperText={errors.email}
                />
                <TextField 
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
                <TextField 
                    name="confirmPw"
                    label="Confirm Password"
                    value={user.confirmpw}
                    onChange={onChange}
                    error={errors.confirmpw}
                    helperText={errors.confirmpw}
                />
                <Button type="submit">Submit</Button>
            </Box>
        </div>
    );
}

export default SignupForm;