import React from 'react';
import Cookies from 'js-cookie';
import {
    Popup, 
    Label,
    Button,
    Card,
    Icon } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this);
        this.editJob = this.editJob.bind(this);
        this.state = {
            jobs: this.props.loadJobs || [],
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.loadJobs !== this.props.loadJobs) {
            this.setState({ jobs: this.props.loadJobs });
        }
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        // Remove closed job from state
        this.setState(prevState =>
            ({ jobs: prevState.jobs.filter(job => job.id !== id) })
        );

        $.ajax({
            url: 'http://localhost:51689/listing/listing/closeJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            type: "post",
            data: JSON.stringify(id),
            success: function (res) {
                if (res.success) {
                    TalentUtil.notification.show(res.message, "success", null, null);

                }
                else {
                    TalentUtil.notification.show(res.message, "error", null, null)
                }
            }.bind(this)
        })
    }

    // Update job, will update if the employer created it
    editJob(id) {
        window.location = "/EditJob/" + id;
    }

    render() {
        let loadJobs = this.props.loadJobs;
        const { jobs } = this.state;

        return (
            <div>
                {jobs.length > 0 ? (
                    <div className="ui three stackable cards">
                        {jobs.map(job => (
                            <Card key={job.id}>
                                <Card.Content>
                                    <Card.Header>{job.title}</Card.Header>
                                    <Label color="black" ribbon="right">
                                        <Icon name="user" />0
                                    </Label>
                                    <Card.Meta>{`${job.location.city}, ${job.location.country}`}</Card.Meta>
                                    <Card.Description>{job.summary}</Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <Label color="red" floated="left" size="medium">Expired</Label>
                                    <Button basic size="mini" floated="right" color="blue">
                                        <Icon name="copy outline" />Copy
                                    </Button>
                                    <Button basic size="mini" floated="right" color="blue" onClick={() => this.editJob(job.id)}>
                                        <Icon name="edit" />Edit
                                    </Button>
                                    <Button basic size="mini" floated="right" color="blue">
                                        <Icon name="ban" />Close
                                    </Button>
                                </Card.Content>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p>No jobs found</p>
                )}

            </div>
        )
    }
}