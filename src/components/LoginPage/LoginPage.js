import React, { Component } from 'react';
import { connect } from 'react-redux';
//COMPONENT IMPORTS
import TwoColumnLayout from '../TwoColumnLayout/TwoColumnLayout';
///MATERIAL-UI IMPORTS
import { Typography, TextField, Button, Grid } from '@material-ui/core';
//STYLING IMPORTS
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';

const styles = theme => ({
    root: {
        display: 'flex'
    },
    formControl: {
        display: 'block',
        margin: theme.spacing(2, 0)
    },
    aboutText: {
        textIndent: '2em',
        letterSpacing: '1px',
        margin: theme.spacing(2),
        padding: theme.spacing(2)
    },
    button: {
        margin: theme.spacing(3, 1),
        padding: theme.spacing(1)
    }
});

class LoginPage extends Component {
    state = {
        email: '',
        password: ''
    };

    login = event => {
        if (this.state.email && this.state.password) {
            this.props.dispatch({
                type: 'LOGIN',
                payload: {
                    username: this.state.email,
                    password: this.state.password
                }
            });

            // if(this.props.user.user_type === 'Student'){
            // 	this.props.history.push('/search/jobs')
            // } else if (this.props.user.user_type === 'Mentor'){
            // 	this.props.history.push('/mentors')
            // } else if (this.props.user.user_type === 'Client'){
            // 	this.props.history.push('/jobs')
            // } else if (this.props.user.user_type === 'Admin'){
            // 	this.props.history.push('/admin')
            // }else {
            this.props.history.push('/');
            // }
        } else {
            this.props.dispatch({ type: 'LOGIN_INPUT_ERROR' });
            this.errorMessage();
        }
    }; // end login

    //saves input in local state on change
    handleInputChangeFor = (propertyName, event) => {
        this.setState({
            [propertyName]: event.target.value
        });
    };

    //Allows user to login using the Enter key while focus is within the Input area
    handleKeyUp = key => {
        if (key.key === 'Enter') {
            this.login();
        }
    };

    errorMessage() {
        Swal.fire({
            position: 'center',
            type: 'error',
            title: 'Error Logging In',
            text: 'Complete all fields.'
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <TwoColumnLayout leftHeader="What is SkillSense?" rightHeader="Log In">
                <Grid container spacing={4} alignItems="center" justify="space-between">
                    <Grid className={classes.aboutText} item xs={12}>
                        <Typography paragraph variant="subtitle1">
                            Freelancing can be especially difficult to break into as a new software
                            developer. Often the connections that Students make with
                            industry professionals will be the key to success.
                        </Typography>
                        <Typography paragraph variant="subtitle1">
                            SkillSense helps create these connections by bringing together Students,
                            Mentors, and Clients alike for freelance projects.
                        </Typography>
                    </Grid>
                </Grid>

                {/* LOGIN INPUT FIELDS */}
                <Grid container item xs={12} justify="space-around" onKeyUp={this.handleKeyUp}>
                    <Grid item xs={12}>
                        <TextField
                            className={classes.formControl}
                            onChange={e => this.handleInputChangeFor('email', e)}
                            value={this.state.email}
                            fullWidth
                            required
                            label="E-Mail"
                            placeholder="user@example.com"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            className={classes.formControl}
                            onChange={event => this.handleInputChangeFor('password', event)}
                            value={this.state.password}
                            required
                            fullWidth
                            type="password"
                            label="Password"
                            placeholder="********"
                            variant="outlined"
                        />
                    </Grid>

                    {/* LOGIN & REGISTER BUTTONS */}
                    <Grid item xs={4} align="center">
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            className={classes.button}
                            onClick={() => this.login()}>
                            Log In
                        </Button>
                    </Grid>

                    <Grid item xs={4} align="center">
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            className={classes.button}
                            onClick={() => {
                                this.props.dispatch({ type: 'SET_TO_REGISTER_MODE' });
                            }}>
                            Create New Account
                        </Button>
                    </Grid>
                </Grid>
            </TwoColumnLayout>
        );
    }
}

const mapStateToProps = state => ({
    errors: state.errors
});

export default connect(mapStateToProps)(withStyles(styles)(LoginPage));
