import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () =>
    //reduxThunk - if return function rather than action, pass in dispatch as argument
    async dispatch => { 
        const res = await axios.get('/api/current_user');
        dispatch({ type: FETCH_USER, payload: res.data});
    };

export const handleToken = (token) => {
    return async dispatch => {
        const res = await axios.post('/api/stripe', token);
        dispatch({ type: FETCH_USER, payload: res.data});
    };
}