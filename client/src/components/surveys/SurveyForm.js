import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import validateEmail from '../../utils/validateEmail';
import formFields from './formFields';

class SurveyForm extends Component {

    renderFields() {
        return _.map(formFields, ({ label, name }) => {
            return (<Field component={SurveyField} type="text" label={label} name={name} key={name} />);
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
                    {this.renderFields()}
                    <Link to="/surveys" className="red btn-flat left white-text">
                        Cancel
                        <i className="material-icons left">arrow_back</i>
                    </Link>
                    <button type="submit" className="teal btn-flat right white-text">
                        Next
                        <i className="material-icons right">arrow_forward</i>
                    </button>
                </form>
            </div>
        );
    }
}

function validate(values) {
    const errors = {};

    errors.recipients = validateEmails(values.recipients || '');
    errors.sender = validateEmail(values.sender || '');
    
    _.each(formFields, ({ name }) => {
        if(!values[name]) { //figure out property at runtime
            errors[name] = 'You must provide a value';
        }
    });

    return errors;
}

export default reduxForm({
    validate,
    form: 'surveyForm',
    destroyOnUnmount: false
})(SurveyForm);