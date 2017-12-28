import { FETCH_SURVEYS, DELETE_SURVEY } from '../actions/types';
import _ from 'lodash';

export default function(state = [], action) {
    switch(action.type) {
        case FETCH_SURVEYS:
            return action.payload;
        case DELETE_SURVEY:
            return _.remove(state, { id: action.payload._id });
        default:
            return state;
    }
}