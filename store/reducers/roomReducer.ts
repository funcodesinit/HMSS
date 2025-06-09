import { ActionTypes } from "../constants/action-types";

export interface UserState {
    rooms: [] | null;
    selected_room: null;
    reservations: [] | null;
    selected_reservation: null;
    bills: [] | null;
    selected_bill: null;
}

const initialState: UserState = {
    rooms: [],
    selected_room: null,
    reservations: [],
    selected_reservation: null,
    bills: [],
    selected_bill: null,
};
 

interface ActionT {
    type: string;
    payload?: any;
}

export const roomReducer = (state = initialState,  action: ActionT) => {
    switch (action.type) {
        case ActionTypes.SET_ROOMS:
            return { ...state, rooms: action.payload, selected_room: null };
        case ActionTypes.SET_SELECTED_SET_ROOM:
            return { ...state, selected_room: action.payload };
        case ActionTypes.SET_RESERVATIONS:
            return { ...state, reservations: action.payload, selected_reservation: null };
        case ActionTypes.SET_SELECTED_RESERVATION:
            return { ...state, selected_reservation: action.payload };
        case ActionTypes.SET_BILLS:
            return { ...state, bills: action.payload, selected_bill: null };
        case ActionTypes.SET_SELECTED_BILL:
            return { ...state, selected_bill: action.payload };
        default:
            return state;
    }
};


