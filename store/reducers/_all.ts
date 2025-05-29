import { combineReducers } from "@reduxjs/toolkit";
import { accountReducer } from "./userReducer";
<<<<<<< HEAD
import { roomReducer } from "./roomReducer";
import { paymentReducer } from "./paymentReducer";

const reducers = combineReducers({
   user: accountReducer,
   room: roomReducer,
   payment: paymentReducer
=======
// import { appReducer } from "./appReducer";

const reducers = combineReducers({
   user: accountReducer,
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
})

export default reducers;