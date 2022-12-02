import { createTheme } from "@mui/material"

// Default initializer of custom theme
export const globalTheme = createTheme({

    components: {
        // Mui: {
        //     defaultProps: {
        //         variant: "standard"
        //     }
        // },
        MuiFormHelperText: {
            defaultProps: {
                margin: 0
            }
        }
    }
})