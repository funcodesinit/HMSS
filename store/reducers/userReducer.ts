import { ActionTypes } from "../constants/action-types";

export interface UserState {
    guests: []|null;
    users: []|null;
    selected_user: null;
<<<<<<< HEAD
    selected_guest: null;
=======
    selected_guests: null;
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
}

const initialState: UserState = {
    guests: null,
    users: [],
    selected_user: null,
<<<<<<< HEAD
    selected_guest: null,
=======
    selected_guests: null,
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
};

export const accountReducer = (state = initialState, { type, payload }) => {
    switch (type) { 
        case ActionTypes.SET_GUESTS:
<<<<<<< HEAD
            return { ...state, guests: payload, selected_guest: null };
=======
            return { ...state, guests: payload };
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
        case ActionTypes.SET_USERS:
            return { ...state, users: payload };
        case ActionTypes.SET_SELECTED_USER:
            return { ...state, selected_user: payload };
        case ActionTypes.SET_SELECTED_GUESTS:
<<<<<<< HEAD
            return { ...state, selected_guest: payload };
=======
            return { ...state, selected_guests: payload };
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
        default:
            return state;
    }
}

