import React, { Component } from "react";
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Location } from '../Employer/CreateJob/Location.jsx';

export class IndividualDetailSection extends Component {
    constructor(props) {
        super(props)

        const details = props.details ?
            Object.assign({}, props.details)
            : {
                firstName: "",
                lastName: "",
                email: "",
                phone: ""
            }

        this.state = {
            showEditSection: false,
            newContact: details,
            formErrors: { firstName: '', lastName: '', email: '', phone: '' },
            firstNameValid: false,
            lastNameValid: false,
            emailValid: false,
            phoneValid: false,
            formValid: true,
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.validateField = this.validateField.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
        this.errorClass = this.errorClass.bind(this);
    }

    handleChange(event) { 
        const name = event.target.name;
        const value = event.target.value;

        const data = Object.assign({}, this.state.newContact)
        data[event.target.name] = event.target.value

        this.setState({
            newContact: data
        }, () => { this.validateField(name, value) })
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let firstNameValid = this.state.firstNameValid;
        let lastNameValid = this.state.lastNameValid;
        let emailValid = this.state.emailValid;
        let phoneValid = this.state.phoneValid;
        var formValid = this.state.formValid;

        switch (fieldName) {
            case 'firstName':
                firstNameValid = value.match(/^[A-Za-z\s'-]+$/);
                fieldValidationErrors.firstName = firstNameValid ? '' : ' is invalid';
                break;
            case 'lastName':
                lastNameValid = value.match(/^[A-Za-z\s'-]+$/);
                fieldValidationErrors.lastName = lastNameValid ? '' : ' is invalid';
                break;
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'phone':
                phoneValid = value.match(/^[0-9]{7,12}$/);
                fieldValidationErrors.phone = phoneValid ? '' : ' is invalid';
            default:
                break;
        }

        if (emailValid != null && phoneValid != null && firstNameValid != null && lastNameValid != null) {
            formValid = true
        }
        else {
            formValid = false
        }

        this.setState({
            formErrors: fieldValidationErrors,
            firstNameValid: firstNameValid,
            lastNameValid: lastNameValid,
            emailValid: emailValid,
            phoneValid: phoneValid,
            formValid: formValid,
        });
    };

    errorClass(error) {
        return (error.length === 0 ? false : true);
    };

    isFormValid() {
        return this.state.formValid == false ? 'error' : '';
    };

    openEdit() {
        const details = Object.assign({}, this.props.details)
        this.setState({
            showEditSection: true,
            newContact: details
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    saveContact() {
        //console.log(this.props.componentId)
        //console.log(this.state.newContact)

        const data = Object.assign({}, this.state.newContact)
        this.props.controlFunc(this.props.componentId, data)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="First Name"
                    name="firstName"
                    value={this.state.newContact.firstName}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your first name"
                    errorMessage="Please enter a valid first name"
                    isError={this.errorClass(this.state.formErrors.firstName)}
                />
                <ChildSingleInput
                    inputType="text"
                    label="Last Name"
                    name="lastName"
                    value={this.state.newContact.lastName}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your last name"
                    errorMessage="Please enter a valid last name"
                    isError={this.errorClass(this.state.formErrors.lastName)}
                />
                <ChildSingleInput
                    inputType="text"
                    label="Email address"
                    name="email"
                    value={this.state.newContact.email}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter an email"
                    errorMessage="Please enter a valid email"
                    isError={this.errorClass(this.state.formErrors.email)}
                />
                <ChildSingleInput
                    inputType="text"
                    label="Phone number"
                    name="phone"
                    value={this.state.newContact.phone}
                    controlFunc={this.handleChange}
                    maxLength={12}
                    placeholder="Enter a phone number"
                    errorMessage="Please enter a valid phone number"
                    isError={this.errorClass(this.state.formErrors.phone)}
                />

                <button type="button" className={`ui teal button ${this.state.formValid ? '' : 'disabled'}`} onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {

        let firstName = this.props.details ? `${this.props.details.firstName}` : ""
        let lastName = this.props.details ? `${this.props.details.lastName}` : ""
        let email = this.props.details ? this.props.details.email : ""
        let phone = this.props.details ? this.props.details.phone : ""

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Name: {`${firstName} ${lastName}`}</p>
                        <p>Email: {email}</p>
                        <p>Phone: {phone}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}
export class CompanyDetailSection extends Component {
    constructor(props) {
        super(props)

        const details = props.details ?
            Object.assign({}, props.details)
            : {
                name: "",
                email: "",
                phone: "",
                location: "",
            }

        this.state = {
            showEditSection: false,
            newContact: details,
            formErrors: { name: '', email: '', phone: '', location: { country: '', city: '' } },
            nameValid: false,
            emailValid: false,
            phoneValid: false,
            locationValid: false,
            locationCountryValid: false,
            locationCityValid: false,
            formValid: true,
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.validateField = this.validateField.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
        this.errorClass = this.errorClass.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        console.log("valueChange", value)

        if (value.city === '0') {
            value.city = '';
        }

        const data = Object.assign({}, this.state.newContact)
        data[event.target.name] = event.target.value

        this.setState({
            newContact: data
        }, () => { this.validateField(name, value) })
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let nameValid = this.state.nameValid;
        let locationValid = this.state.locationValid;
        let locationCityValid = this.state.locationCityValid;
        let locationCountryValid = this.state.locationCountryValid;
        let emailValid = this.state.emailValid;
        let phoneValid = this.state.phoneValid;
        var formValid = this.state.formValid;

        switch (fieldName) {
            case 'name':
                nameValid = value.match(/\S/);
                fieldValidationErrors.name = nameValid ? '' : ' is invalid';
                break;
            case 'location':
                locationCountryValid = value.country && value.country !== '' && value.country.trim() !== '';
                locationCityValid = value.city && value.city !== '' && value.city.trim() !== '';
                locationValid = locationCountryValid && locationCityValid;

                // Make sure the error object exists
                if (!fieldValidationErrors.location) {
                    fieldValidationErrors.location = {};
                }

                fieldValidationErrors.location.country = locationCountryValid ? '' : 'Please select a country';
                fieldValidationErrors.location.city = locationCityValid ? '' : 'Please select a city';
                break;
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'phone':
                phoneValid = value.match(/^[0-9]{7,12}$/);
                fieldValidationErrors.phone = phoneValid ? '' : ' is invalid';
                break;
            default:
                break;
        }

        if (nameValid != null && emailValid != null && phoneValid != null && locationValid != '')
        {
            formValid = true
        }
        else {
            formValid = false
        }

        this.setState({
            formErrors: fieldValidationErrors,
            nameValid: nameValid,
            locationValid: locationValid,
            locationCountryValid: locationCountryValid,
            locationCityValid: locationCityValid,
            emailValid: emailValid,
            phoneValid: phoneValid,
            formValid: formValid,
        });
    };

    errorClass(error) {
        return (error.length === 0 ? false : true);
    };

    isFormValid() {
        return this.state.formValid == false ? 'error' : '';
    };

    openEdit() {
        const details = Object.assign({}, this.props.details)
        this.setState({
            showEditSection: true,
            newContact: details
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    saveContact() {
        const data = Object.assign({}, this.state.newContact)
        this.props.controlFunc(this.props.componentId, data)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        let location = { city: '', country: '' }
        if (this.state.newContact && this.state.newContact.location) {
            location = this.state.newContact.location
        }

        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="Name"
                    name="name"
                    value={this.state.newContact.name}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your company name"
                    errorMessage="Please enter a valid company name"
                    isError={this.errorClass(this.state.formErrors.name)}
                />
                <ChildSingleInput
                    inputType="text"
                    label="Email address"
                    name="email"
                    value={this.state.newContact.email}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter an email"
                    errorMessage="Please enter a valid email"
                    isError={this.errorClass(this.state.formErrors.email)}
                />
                <ChildSingleInput
                    inputType="text"
                    label="Phone number"
                    name="phone"
                    value={this.state.newContact.phone}
                    controlFunc={this.handleChange}
                    maxLength={12}
                    placeholder="Enter a phone number"
                    errorMessage="Please enter a valid phone number"
                    isError={this.errorClass(this.state.formErrors.phone)}
                />
                <p>Location:</p>
                <div>
                    {(!this.state.newContact.location.country || !this.state.newContact.location.city) // locationValid = false
                        ? <div className="ui pointing below red basic label">Please select a location</div>
                        : null
                    }
                </div>
                <Location
                    location={location}
                    handleChange={this.handleChange}
                    name="location"
                />
                
                <button type="button" className={`ui teal button ${this.state.formValid ? '' : 'disabled'}`} onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {

        let companyName = this.props.details ? this.props.details.name : ""
        let email = this.props.details ? this.props.details.email : ""
        let phone = this.props.details ? this.props.details.phone : ""
        let location = { city: '', country: '' }
        if (this.props.details && this.props.details.location) {
            location = this.props.details.location
        }

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Name: {companyName}</p>
                        <p>Email: {email}</p>
                        <p>Phone: {phone}</p>
                        <p> Location: {location.city}, {location.country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}