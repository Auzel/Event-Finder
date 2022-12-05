import React from "react";
import { TextField, InputAdornment, IconButton, FormHelperText, FormControl } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"
import '../scss/AddReviewPage.scss'
import SubmitButton from "./SubmitButton";
import { Rating } from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Link } from 'react-router-dom';

/**
 * SignupForm is not a component, but a function
 * that returns the react layout after assigning
 * the parameter values to the correct react
 * component. This is simply a way to make the
 * code more segmented and readable.
 */
const AddReviewForm = ({
    onSubmit,
    onChangeRating,
    onChangeTitle,
    onChangeDate,
    onChangeDescription,
    errors,
    review,
}) => {
    return (
        <div>
            <form onSubmit={onSubmit} className="formReview">
                <h1>ADD REVIEW</h1>
                <FormHelperText error={errors.message ? true : false}>{errors.message}</FormHelperText>
                <div className="component ratingDiv">
                    <FormControl className="formControl">
                        <FormHelperText className="component-helper-text">
                            How would you rate this venue?
                        </FormHelperText>
                        <Rating
                            name="rating"
                            onChange={onChangeRating}
                            size="large"
                            value={review.rating}
                            precision={0.5} 
                            error={errors.rating ? true : false}
                            helperText={errors.rating}
                        />
                    </FormControl>
                </div>
                <div className="component titleDiv">
                    <FormControl className="formControl">
                        <FormHelperText className="component-helper-text">
                            What event did you attend at this venue?
                        </FormHelperText>
                        <TextField 
                            variant="standard"
                            fullWidth={true}
                            className="input"
                            name="title"
                            placeholder="Title"
                            value={review.title}
                            onChange={onChangeTitle}
                            error={errors.title ? true : false}
                            helperText={errors.title}
                        />
                    </FormControl>
                </div>
                <div className="component dateDiv">
                    <FormControl className="formControl">
                        <FormHelperText className="component-helper-text">
                            What date did you attend the event?
                        </FormHelperText>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                inputFormat="MM/DD/YYYY"
                                value={review.date.format()}
                                onChange={onChangeDate}
                                renderInput={(params) => <TextField {...params} />}
                                />
                        </LocalizationProvider>
                        {/* <TextField 
                            variant="standard"
                            fullWidth={true}
                            className="input"
                            name="date"
                            // label="Date"
                            placeholder="Date"
                            value={review.date}
                            onChange={onChangeDate}
                            error={errors.date ? true : false}
                            helperText={errors.date}
                        /> */}
                    </FormControl>
                </div>
                <div className="component descriptionDiv">
                    <FormControl className="formControl">
                        <FormHelperText id="component-helper-text">
                            Describe your experience at this event.
                        </FormHelperText>
                        <TextField 
                            variant="outlined"
                            fullWidth={true}
                            className="input"
                            name="description"
                            placeholder="Description"
                            // Maxes this a multiline text input component
                            multiline
                            minRows={2}
                            maxRows={4}
                            value={review.description}
                            onChange={onChangeDescription}
                            error={errors.description ? true : false}
                            helperText={errors.description}
                            // Set max chracters for the input
                            inputProps={{maxLength: 140}}
                        />
                    </FormControl>
                </div>
                <div className="component submitDiv">
                    <SubmitButton variant="small" text="SUBMIT" />
                    
                    <Link to = "/Map" className="cancelLink"> <button className="cancelButton"> CANCEL</button> </Link>
                </div>
            </form>
        </div>
    );
}

export default AddReviewForm;