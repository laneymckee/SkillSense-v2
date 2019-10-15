import React, { Component } from 'react';
import { connect } from 'react-redux';

//MATERIAL-UI IMPORTS
import { withStyles } from '@material-ui/core/styles';
import {
    Grid,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
    Paper,
    Tooltip
} from '@material-ui/core';

const styles = theme => ({
    root: {
        // align: 'center'
    },
    paper: {
        width: 250,
        height: 250,
        align: 'center',
        overflow: 'scroll'
    },
    listField: {
        position: 'relative'
    }
});

class TransferList extends Component {
    state = {
        availableSkills: [],
        selectedSkills: []
    };

    //sends post request for clicked skill ID
    addSkill = skillId => {
        this.props.dispatch({ type: 'ADD_SKILL', payload: { id: skillId } });
    };

    //sends delete request for clicked skill ID
    removeSkill = skillId => {
        this.props.dispatch({ type: 'REMOVE_SKILL', payload: { id: skillId } });
    };

    //function to map over all skills and remove any that are matches of user's skills
    getAvailableSkills = () => {
        return this.props.allSkills.map(skill =>
            this.props.user.skills.some(userSkill => userSkill.id === skill.id) ? null : (
                <Tooltip key={skill.id} title="Add to Your Skills" placement="right">
                    <ListItem role="listitem" button onClick={() => this.addSkill(skill.id)}>
                        <ListItemText primary={skill.tag} />
                    </ListItem>
                </Tooltip>
            )
        );
    };

    //function get list of user's skills
    getUserSkills = () => {
        return this.props.user.skills.map(skill => (
            <Tooltip key={skill.id} title="Remove From Your Skills" placement="left">
                <ListItem
                    key={skill.id}
                    role="listitem"
                    button
                    onClick={() => this.removeSkill(skill.id)}>
                    <ListItemText primary={skill.tag} />
                </ListItem>
            </Tooltip>
        ));
    };

    render() {
        const { classes } = this.props;

        return (
            <Grid container direction="row" spacing={3} justify="center" className={classes.root}>
                <Grid item container spacing={3} direction="row" xs={12} sm={6} justify="center">
                    <Grid item xs={12} justify="center">
                        <Typography variant="subtitle2" color="primary" align="center">
                            AVAILABLE SKILLS
                        </Typography>
                    </Grid>

                    <Grid item className={classes.listField} xs={6} justify="center">
                        <Paper className={classes.paper} align="center">
                            <Divider />
                            <List>{this.getAvailableSkills()}</List>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid item container spacing={3} direction="row" xs={12} sm={6} justify="center">
                    <Grid item xs={12} justify="center">
                        <Typography variant="subtitle2" align="center">
                            YOUR SKILLS
                        </Typography>
                    </Grid>

                    <Grid item className={classes.listField} xs={6} justify="center">
                        <Paper className={classes.paper} align="center">
                            <Divider />
                            <List>{this.props.user.skills && this.getUserSkills()}</List>
                        </Paper>
                    </Grid>

                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    // user: state.user,
    allSkills: state.allSkillsReducer,
    userSkills: state.userSkillsReducer
});

export default connect(mapStateToProps)(withStyles(styles)(TransferList));
