import { Interface } from "readline";
import { ActionTypes } from "../constants/action-types";

export interface PaymentState {
    products: [] | null;
    category: [] | null;
    selected_product: null;
    orders: [] | null;
    selected_order: null;
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
    products: [],
    category: [],
    selected_product: null,
    orders: [],
    selected_order: null,
    bills: [],
    selected_bill: null,
    stats: {
        totalAmount: 0,
        uniqueGuestCount: 0,
        averageTransactionsPerGuest: 0,
        averageAmountPerGuest: 0,
    }
};

interface ActionT {
    type: string;
    payload?: any;
}

export const paymentReducer = (
    state: PaymentState = initialState,
    action: ActionT
): PaymentState => {
    switch (action.type) {
        case ActionTypes.SET_PRODUCTS:
            return { ...state, products: action.payload, selected_product: null };

        case ActionTypes.SET_SELECTED_PRODUCT:
            return { ...state, selected_product: action.payload };

        case ActionTypes.SET_CATEGORY:
            return { ...state, category: action.payload };

        case ActionTypes.SET_BILLS:
            return { ...state, bills: action.payload, selected_bill: null };

        case ActionTypes.SET_SELECTED_BILL:
            return { ...state, selected_bill: action.payload };

        case ActionTypes.SET_POS_STATS:
            return { ...state, stats: action.payload };

        case ActionTypes.SET_ORDERS:
            return { ...state, orders: action.payload, selected_order: null };

        case ActionTypes.SET_SELECTED_ORDER:
            return { ...state, selected_order: action.payload };

        default:
            return state;
    }
};