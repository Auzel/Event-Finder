import React from 'react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import AccountInformation from './AccountInformation';
import AccountHistory from './AccountHistory';
import EditAccount from './EditAccount';
import Map from './Map';
// import './Views/Styles.scss';
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
            <Route path = '/EditAccount' element = {<EditAccount/>}/>
            <Route path = '/Map' element ={<Map/>}/>
          </Routes>
        </ThemeProvider>
      </CssBaseline>
    </>
  )
}

export default App;
