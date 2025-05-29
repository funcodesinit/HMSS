    import { ActionTypes } from "../constants/action-types";

    export interface PaymentState {
        pos: [] | null;
        selected_pos: null;
        bills: [] | null;
        selected_bill: null;
        stats: {
            totalAmount: number,
            uniqueGuestCount: number,
            averageTransactionsPerGuest: number,
            averageAmountPerGuest: number,
        };
    }

    const initialState: PaymentState = {
        pos: [],
        selected_pos: null,
        bills: [],
        selected_bill: null,
        stats:{
            totalAmount:0,
            uniqueGuestCount:0,
            averageTransactionsPerGuest:0,
            averageAmountPerGuest:0,
        }
    };


export const paymentReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_POS:
            return { ...state, pos: payload, selected_pos: null };
        case ActionTypes.SET_BILLS:
            return { ...state, bills: payload, selected_bill: null };
        case ActionTypes.SET_SELECTED_BILL:
            return { ...state, selected_bill: payload };
        case ActionTypes.SET_POS_STATS:
            return { ...state, stats: payload };
        default:
            return state;
    }
};
