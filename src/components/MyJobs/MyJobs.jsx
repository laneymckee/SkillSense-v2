import React, { Component } from 'react';
import { connect } from 'react-redux';

//COMPONENT IMPORTS
import OneColumnLayout from '../OneColumnLayout/OneColumnLayout';
import JobTabs from '../JobsTabs/JobTabs';
import JobListItem from '../JobListItem/JobListItem';
import { Typography } from '@material-ui/core';
//MATERIAL-UI IMPORTS
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    placeholder: {
        padding: theme.spacing(2)
    }
});

class MyJobs extends Component {
    componentDidMount() {
        if (this.props.user.user_type === 'Student') {
            this.props.dispatch({
                type: 'FETCH_ACTIVE_JOBS'
            });//sends to jobSaga
        } else if (this.props.user.user_type === 'Client') {
            this.props.dispatch({
                type: 'FETCH_CLIENT_JOBS',
                //active job status by default
                payload: 3
            });//sends to jobSaga
        }
    }

    render() {
        const { classes } = this.props;
        //uses the JobListItem component to render the job search results
        let jobList = this.props.jobs.map((job, i) => {
            return <JobListItem key={i} job={job} />;
        });

        //checks if user type should be able to view this page
        let isStudent = () => {
            return this.props.user.user_type === 'Student';
        };

        //checks if user type should be able to view this page
        let isClient = () => {
            return this.props.user.user_type === 'Client';
        };

        return (
            <>
                {isStudent() || isClient() ? (
                    <OneColumnLayout header="My Jobs">
                        <>
                            <JobTabs />
                        </>
                        {/* Selected Job List */}
                        <div className="list">
                            {this.props.jobs.length !== 0 ? (
                                jobList
                            ) : (
                                    <Typography
                                        variant="subtitle1"
                                        align="center"
                                        color="secondary"
                                        className={classes.placeholder}
                                        gutterBottom>
                                        No items to display.
                                </Typography>
                                )}
                        </div>
                    </OneColumnLayout>
                ) : (
                        <Typography>You are not authorized to view this page</Typography>
                    )}
            </>
        );
    }
}

const mapStateToProps = store => {
    return {
        user: store.user,
        jobs: store.allJobsReducer
    };
};

export default connect(mapStateToProps)(withStyles(styles)(MyJobs));
