import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys, deleteSurvey } from '../../actions';

class SurveyList extends Component {

    componentDidMount() {
        this.props.fetchSurveys();
    }

    onDeleteClick(surveyId) {
        this.props.deleteSurvey(surveyId);
    }

    renderSurveys() {
        if(this.props.surveys.length == 0) {
            return (
                <div style={{ textAlign: 'center', fontSize: '20px' }}>
                    Looks like you don't have a campaign yet. Start now!
                </div>
            );
        }
        return this.props.surveys.reverse().map(survey => {
            return(
                <div className="card blue-grey darken-1" key={survey._id}>
                    <button 
                        className="waves-effect waves-light btn-large red right"
                        onClick={this.onDeleteClick.bind(this, survey._id)}
                    >
                        <i className="material-icons">close</i>
                    </button>
                    <div className="card-content white-text">
                        <span className="card-title">{survey.title}</span>
                        <p>{survey.body}</p>
                        <p className="right">
                            Sent On: {new Date(survey.dateSent).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="card-action">
                        <a>Yes: {survey.yes}</a>
                        <a>No: {survey.no}</a>
                    </div>
                </div>
            );
        });
    }

    render() {
        return(
            <div>
                {this.renderSurveys()}
            </div>
        );
    }
}

function mapStateToProps({ surveys }) {
    return { surveys };
}

export default connect(mapStateToProps, { fetchSurveys, deleteSurvey })(SurveyList);