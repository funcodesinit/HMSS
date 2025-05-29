import { combineReducers } from "@reduxjs/toolkit";
import { accountReducer } from "./userReducer";
import { roomReducer } from "./roomReducer";
import { paymentReducer } from "./paymentReducer";

const reducers = combineReducers({
   user: accountReducer,
   room: roomReducer,
   payment: paymentReducer
})

export default reducers;