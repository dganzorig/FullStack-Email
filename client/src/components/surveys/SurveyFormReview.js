import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'; //history obj. for redirect
import _ from 'lodash';
import formFields from './formFields';
import * as actions from '../../actions';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {

    const reviewFields = _.map(formFields, ({ name, label }) => {
        return (
            <div key={name}>
                <label>{label}</label>
                <div style={{ marginBottom: '10px'}}>
                    {formValues[name]}
                </div>
            </div>
        );
    });
    
    return (
        <div>
            <h5>Please confirm your entries:</h5>
            <div style={{ marginBottom: '25px' }}>
                { reviewFields }
            </div>
            <button 
                className="yellow white-text darken-3 btn-flat left"
                onClick={onCancel}>
                Back
                <i className="material-icons left">arrow_back</i>
            </button>
            <button 
                className="green white-text btn-flat right"
                onClick={() => submitSurvey(formValues, history)}   
            >
                Send Survey
                <i className="material-icons right">send</i>
            </button>
        </div>
    );
}

function mapStateToProps(state) {
    return { formValues: state.form.surveyForm.values };
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));