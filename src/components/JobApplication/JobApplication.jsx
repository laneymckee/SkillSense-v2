import React, { Component } from 'react';
import { connect } from 'react-redux';
//COMPONENT IMPORTS
import OneColumnLayout from '../OneColumnLayout/OneColumnLayout';
import SkillList from '../SkillList/SkillList';
import JobApplicationMentorListItem from '../JobApplicationMentorListItem/JobApplicationMentorListItem';
//MATERIAL-UI IMPORTS
import { Grid, Typography, TextField, Button, Divider } from '@material-ui/core';
//STYLING IMPORTS
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';

const styles = theme => ({
    root: {
        margin: 'auto',
        width: '70vw'
    },
    mentorList: {
        overflowX: 'scroll',
        overflowY: 'hidden',
        maxHeight: '20vh'
    },
    largeFormControl: {
        margin: theme.spacing(1)
    }
});
class JobApplication extends Component {
    state = {
        cover_letter: '',
        mentor_id: null,
        payment_terms: 'negotiable',
        attachment_url: '',
        file: null
    };
    componentDidMount() {
        this.props.dispatch({
            type: 'FETCH_JOB_DETAIL',
            payload: { id: Number(this.props.match.params.id) }
        });
        this.props.dispatch({
            type: 'FETCH_ACTIVE_MENTORS'
        });
    }

    handleInput = (event, property) => {
        this.setState({
            ...this.state,
            [property]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to redact your application!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#04b8f3',
            cancelButtonColor: '#505d68',
            confirmButtonText: 'Yes, submit it!'
        }).then(result => {
            if (result.value) {
                this.props.dispatch({
                    type: 'SUBMIT_APPLICATION',
                    payload: {
                        ...this.state,
                        job_id: Number(this.props.match.params.id)
                    }
                });
                this.props.history.push(`/jobs/detail/${this.props.match.params.id}`);
            }
        });
    };

    //on application submission, return to job search
    routeBack = () => {
        this.props.history.push(`/search/jobs`);
    };

    //upload resume file
    handleUploadInputChange = e => {
        // console.log(e.target.files[0])
        this.setState({ file: e.target.files[0] });
    };

    //select mentor for job
    handleSelect = id => {
        this.state.mentor_id === id
            ? this.setState({ mentor_id: null })
            : this.setState({ mentor_id: id });
    };

    //list of mentors will be sorted by matching skills
    sortMentors = (mentors, jobSkills) => {
        mentors.forEach(mentor => {
            mentor.matchingSkillCount = mentor.skills.filter(tag =>
                jobSkills.map(skill => skill.id).includes(tag.id)
            ).length;
        });
        return mentors.sort((a, b) => b.matchingSkillCount - a.matchingSkillCount);
    };

    render() {
        const { classes } = this.props;

        //checks if user should be able to view page
        let isStudent = () => {
            return this.props.user.user_type === 'Student';
        };

        return (
            <OneColumnLayout header="Job Application">
                {isStudent() ? (
                    <Grid container className={classes.root} spacing={4}>
                        {/* JOB INFO */}
                        <Grid item container xs={12} sm={6}>
                            <Grid item xs={12}>
                                <Typography variant="h4" color="primary">
                                    {this.props.job.position_title}
                                </Typography>
                                <Typography variant="h5" color="secondary">
                                    {this.props.job.project_title}
                                </Typography>
                                <Typography variant="h6">
                                    {this.props.job.username}, {this.props.job.location}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {this.props.job.location}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="secondary">
                                    Duration: <span>{this.props.job.duration}</span>
                                </Typography>
                                <Typography variant="subtitle1" color="secondary">
                                    Budget: $<span>{this.props.job.budget}</span>
                                </Typography>
                            </Grid>
                        </Grid>

                        {/* DESIRED SKILLS */}
                        <Grid item xs={12} sm={6} align="right">
                            {this.props.job.skills && (
                                <SkillList skillList={this.props.job.skills} />
                            )}
                        </Grid>

                        {/* SECTION DIVIDER BETWEEN FORM */}
                        <Grid item xs={12} className={classes.divider}>
                            <Divider />
                        </Grid>

                        {/* COVER LETTER FORM */}
                        <Grid item container xs={12} spacing={4} justify="center">
                            <Grid item xs={12}>
                                <Typography variant="h6" align="left">
                                    Cover Letter
                                </Typography>
                                <TextField
                                    id="standard-name"
                                    align="left"
                                    multiline
                                    rows="4"
                                    fullWidth
                                    variant="outlined"
                                    helperText="Write your cover letter to the client here. 
                                    Explain what would make you a good fit for this job."
                                    value={this.state.cover_letter}
                                    onChange={event => {
                                        this.handleInput(event, 'cover_letter');
                                    }}
                                    className={classes.largeFormControl}
                                />
                            </Grid>

                            {/* RESUME UPLOAD */}
                            <Grid item xs={12}>
                                <TextField
                                    helperText="Attach Project Proposal"
                                    type="file"
                                    onChange={this.handleUploadInputChange}
                                />
                            </Grid>
                        </Grid>

                        {/* Mentor Info */}
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="h6">Select a Mentor</Typography>
                            </Grid>
                            <Grid
                                item
                                container
                                direction="column"
                                alignContent="flex-start"
                                justify="flex-start"
                                className={classes.mentorList}>
                                {this.props.mentors &&
                                    this.props.job &&
                                    this.props.job.skills &&
                                    this.sortMentors(this.props.mentors, this.props.job.skills).map(
                                        listUser => {
                                            return (
                                                <JobApplicationMentorListItem
                                                    key={listUser.id}
                                                    selected={listUser.id === this.state.mentor_id}
                                                    listUser={listUser}
                                                    selectMentor={this.handleSelect}
                                                />
                                            );
                                        }
                                    )}
                            </Grid>
                        </Grid>

                        {/* SUBMIT & BACK BUTTONS */}
                        <Grid item xs={12} align="space-around">
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => this.routeBack()}>
                                    Back
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleSubmit}>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography>You are not authorized to view this page.</Typography>
                )}
            </OneColumnLayout>
        );
    }
}

const mapStateToProps = store => {
    return {
        job: store.selectedJobReducer,
        user: store.user,
        mentors: store.allMentorsReducer
    };
};

export default connect(mapStateToProps)(withStyles(styles)(JobApplication));
