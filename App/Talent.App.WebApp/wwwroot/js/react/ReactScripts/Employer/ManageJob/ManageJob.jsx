import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: true, // so all items can be displayed, regardless
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: "",
            limit: 6, // default in listings backend
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);

        //your functions go here
        this.handlePagination = this.handlePagination.bind(this);
        this.handleSortByDate = this.handleSortByDate.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)

        //console.log("init", this.state.loaderData) // employer, recruiter
    }

    componentDidMount() {
        this.init();
        this.loadData();
    };

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs?'; // ? is added otherwise it won't display, similar to CreateJob.jsx
        var cookies = Cookies.get('talentAuthToken');

        // state is added because it is a requirement fot the getSortedEmployerJobs but not implemented as not part of the task
        const { activePage, sortBy, limit } = this.state;
        const { showActive, showClosed, showDraft, showExpired, showUnexpired } = this.state.filter;

        // params, use postman to get an idea
        const param = `activePage=${activePage}&sortbyDate=${sortBy.date}&showActive=${showActive}&showClosed=${showClosed}&showDraft=${showDraft}&showExpired=${showExpired}&showUnexpired=${showUnexpired}&limit=${limit}`;

        $.ajax({
            url: link + param,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    TalentUtil.notification.show(res.message || "Jobs fetched successfully!", "success", null, null);
                    const totalPages = Math.ceil(res.totalCount / limit);
                    this.setState({ loadJobs: res.myJobs, totalPages });
                } else {
                    TalentUtil.notification.show(res.message || "Error fetching jobs", "error", null, null)
                }
            }.bind(this)
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    handlePagination(e, { activePage }) {
        this.setState({ activePage }, () => this.loadData());
    }

    handleSortByDate(e, { value }) {
        e.preventDefault();
        const sortBy = Object.assign({}, this.state.sortBy)
        sortBy.date = value;
        this.setState({ sortBy }, () => this.loadData());
        console.log("value", value)
    }

    render() {
        let { loadJobs, totalPages, activePage } = this.state;

        const dateOptions = [
            { key: 'desc', value: 'desc', text: 'Newest first' },
            { key: 'asc', value: 'asc', text: 'Oldest first' }
        ];

        const filterOptions = [
            { key: 'Active', value: 'Active', text: 'Active' },
            { key: 'Closed', value: 'Closed', text: 'Closed' },
            { key: 'Draft', value: 'Draft', text: 'Draft' },
            { key: 'Expired', value: 'Expired', text: 'Expired' },
            { key: 'Unexpired', value: 'Unexpired', text: 'Unexpired' },
        ];


        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h1>List of Jobs</h1>
                    <p>
                        <Icon name='filter' /><span>Filter: </span>
                        <Dropdown inline defaultValue={filterOptions[0].value} options={filterOptions} />
                        <Icon name='calendar alternate' /><span>Sort by date: </span>
                        <Dropdown inline defaultValue={dateOptions[0].value} options={dateOptions} onChange={this.handleSortByDate} />
                    </p>
                    <JobSummaryCard loadJobs={loadJobs} />
                </div>
                <Segment basic textAlign='center'>
                    <Pagination defaultActivePage={activePage} totalPages={totalPages} onPageChange={this.handlePagination} />
                </Segment>
            </BodyWrapper>
        )
    }
}