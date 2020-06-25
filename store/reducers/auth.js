import { PRODUCTS } from '../../data/dummydata';
import { LOGIN, SIGNUP, AUTHENTICATE, LOGOUT } from '../actions/auth';
import Product from '../../models/product';

const initialState = {
    token: null,
    userId: null
};

export default authReducer = (state = initialState, action) =>{
    switch(action.type){
        case AUTHENTICATE:
            return {
                ...state,
                token: action.token,
                userId: action.userId
            }
        case LOGOUT: 
            return initialState
        default:
            return state;

    }
}