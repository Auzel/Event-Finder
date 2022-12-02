import React from "react";
import { TextField, InputAdornment, IconButton, FormHelperText } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"
import '../scss/EditReviewPage.scss'
import SubmitButton from "./SubmitButton";
/**
 * SignupForm is not a component, but a function
 * that returns the react layout after assigning
 * the parameter values to the correct react
 * component. This is simply a way to make the
 * code more segmented and readable.
 */
const EditReviewForm = ({
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
                <h1>Add Review</h1>
                <FormHelperText error={errors.message ? true : false}>{errors.message}</FormHelperText>
                <div className="component ratingDiv">
                    <TextField 
                        variant="standard"
                        fullWidth={true}
                        className="input"
                        name="rating"
                        label="Rating"
                        value={review.rating}
                        onChange={onChangeRating}
                        error={errors.rating ? true : false}
                        helperText={errors.rating}
                    />
                </div>
                <div className="component titleDiv">
                    <TextField 
                        variant="standard"
                        fullWidth={true}
                        className="input"
                        name="title"
                        label="Title"
                        value={review.title}
                        onChange={onChangeTitle}
                        error={errors.title ? true : false}
                        helperText={errors.title}
                    />
                </div>
                <div className="component dateDiv">
                    <TextField 
                        variant="standard"
                        fullWidth={true}
                        className="input"
                        name="date"
                        label="Date"
                        value={review.date}
                        onChange={onChangeDate}
                        error={errors.date ? true : false}
                        helperText={errors.date}
                    />
                </div>
                <div className="component descriptionDiv">
                    <TextField 
                        variant="standard"
                        fullWidth={true}
                        className="input"
                        name="description"
                        label="Description"
                        value={review.description}
                        onChange={onChangeDescription}
                        error={errors.description ? true : false}
                        helperText={errors.description}
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

export default EditReviewForm;