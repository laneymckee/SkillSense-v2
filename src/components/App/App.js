import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

//COMPONENT IMPORTS
////constants
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

////ROUTES
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

////VIEWS
import UserPage from '../UserPage/UserPage';
import JobApplication from '../JobApplication/JobApplication';
import JobDetail from '../JobDetail/JobDetail';
import ApplicantReview from '../ApplicantReview/ApplicantReview';
import ApplicantDetail from '../ApplicantDetail/ApplicantDetail';
import JobPostForm from '../JobPostForm/JobPostForm';
import JobSearch from '../JobSearch/JobSearch';
import MentorReview from '../MentorReview/MentorReview';
import MentorSearch from '../MentorSearch/MentorSearch';
import MessagesCenter from '../MessagesCenter/MessagesCenter';
import MyJobs from '../MyJobs/MyJobs';
import MyMentorships from '../MyMentorships/MyMentorships';

//STYLING/MATERIAL-UI IMPORTS
import { CssBaseline, Typography } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import './App.css';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Ubuntu'
    },
    palette: {
        primary: {
            main: '#08b8f4',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#505d68',
            contrastText: '#ffffff'
        },
        error: {
            main: '#c2d1d9'
        }
    }
});

class App extends Component {
    componentDidMount() {
        this.props.dispatch({
            type: 'FETCH_USER'
        });//sends to userSaga
    }
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Nav />
                    <Switch>
                        {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
                        <Redirect exact from="/" to="/home" />
                        {/* For protected routes, the view could show one of several things on the same route.
                              Visiting localhost:3000/home will show the UserPage if the user is logged in.
                              If the user is not logged in, the ProtectedRoute will show 'Login' or 'Register' page.
                              Even though it seems like they are different pages,
                              the user is always on localhost:3000/home */}
                        <ProtectedRoute
                            exact
                            path="/home" //user profile page
                            component={UserPage}
                        />
                        {/* This works the same as the other protected route,
                            except that if the user is logged in, they will see the login/register page instead. */}
                        <ProtectedRoute exact path="/search/jobs" component={JobSearch} />
                        <ProtectedRoute exact path="/search/mentors" component={MentorSearch} />
                        <ProtectedRoute exact path="/jobs" component={MyJobs} />
                        <ProtectedRoute exact path="/mentors" component={MyMentorships} />
                        <ProtectedRoute exact path="/jobs/new" component={JobPostForm} />
                        <ProtectedRoute exact path="/jobs/detail/:id" component={JobDetail} />
                        <ProtectedRoute exact path="/jobs/detail/apply/:id" component={JobApplication} />
                        <ProtectedRoute exact path="/jobs/detail/applications/:id" component={ApplicantReview} />
                        <ProtectedRoute exact path="/jobs/detail/applicant/:id" component={ApplicantDetail} />
                        <ProtectedRoute exact path="/admin" component={MentorReview} />
                        <ProtectedRoute exact path="/messages" component={MessagesCenter} />
                        {/* If none of the other routes matched, we will show a 404. */}
                        <Route
                            render={() => <Typography variant="h1">404: Page Not Found</Typography>}
                        />
                    </Switch>
                    <Footer />
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default connect()(App);
