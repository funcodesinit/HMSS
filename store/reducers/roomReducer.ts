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
 
export const roomReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_ROOMS:
            return { ...state, rooms: payload, selected_room: null };
        case ActionTypes.SET_SELECTED_SET_ROOM:
            return { ...state, selected_room: payload };
        case ActionTypes.SET_RESERVATIONS:
            return { ...state, reservations: payload, selected_reservation: null };
        case ActionTypes.SET_SELECTED_RESERVATION:
            return { ...state, selected_reservation: payload };
        case ActionTypes.SET_BILLS:
            return { ...state, bills: payload, selected_bill: null };
        case ActionTypes.SET_SELECTED_BILL:
            return { ...state, selected_bill: payload };
        default:
            return state;
    }
};


