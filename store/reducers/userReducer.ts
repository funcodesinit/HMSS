import { ActionTypes } from "../constants/action-types";

export interface UserState {
    guests: []|null;
    users: []|null;
    selected_user: null;
    selected_guests: null;
}

const initialState: UserState = {
    guests: null,
    users: [],
    selected_user: null,
    selected_guests: null,
};

export const accountReducer = (state = initialState, { type, payload }) => {
    switch (type) { 
        case ActionTypes.SET_GUESTS:
            return { ...state, guests: payload };
        case ActionTypes.SET_USERS:
            return { ...state, users: payload };
        case ActionTypes.SET_SELECTED_USER:
            return { ...state, selected_user: payload };
        case ActionTypes.SET_SELECTED_GUESTS:
            return { ...state, selected_guests: payload };
        default:
            return state;
    }
}

