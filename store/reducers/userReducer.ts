import { ActionTypes } from "../constants/action-types";

export interface UserState {
    guests: []|null;
    users: []|null;
    selected_user: null;
    selected_guest: null;
}

const initialState: UserState = {
    guests: null,
    users: [],
    selected_user: null,
    selected_guest: null,
};


interface ActionT {
    type: string;
    payload?: any;
}

export const accountReducer = (state = initialState, 
    action: ActionT

) => {
    switch (action.type) { 
        case ActionTypes.SET_GUESTS:
            return { ...state, guests: action.payload };
        case ActionTypes.SET_USERS:
            return { ...state, users: action.payload };
        case ActionTypes.SET_SELECTED_USER:
            return { ...state, selected_user: action.payload };
        case ActionTypes.SET_SELECTED_GUESTS:
            return { ...state, selected_guest: action.payload };
        default:
            return state;
    }
}

