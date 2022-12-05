import React from 'react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import AccountInformation from './AccountInformation';
import AccountHistory from './AccountHistory';
import EditAccountPage from './EditAccountPage';
import AddReviewPage from './AddReviewPage';
import EditReviewPage from './EditReviewPage';
import MapPage from './MapPage';
import {Routes, Route} from 'react-router-dom';
import { globalTheme } from '../globalTheme.js'
import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <>
      <CssBaseline>
        <ThemeProvider theme={globalTheme}>
          <Routes>
            <Route path = '/' element = {<LandingPage/>}/>
            <Route path = '/LoginPage' element = {<LoginPage/>}/>
            <Route path = '/SignupPage' element ={<SignupPage/>}/>
            <Route path = '/AccountInformation' element = {<AccountInformation/>}/>
            <Route path = '/AccountHistory' element ={<AccountHistory/>}/>
            <Route path = '/EditAccountPage' element = {<EditAccountPage/>}/>
            <Route path = '/Map' element ={<MapPage/>}/>
            <Route path = '/AddReviewPage' element ={<AddReviewPage/>}/>
            <Route path = '/EditReviewPage' element ={<EditReviewPage/>}/>
          </Routes>
        </ThemeProvider>
      </CssBaseline>
    </>
  )
}

export default App;
