import { combineReducers } from "@reduxjs/toolkit";
import { accountReducer } from "./userReducer";
// import { appReducer } from "./appReducer";

const reducers = combineReducers({
   user: accountReducer,
})

export default reducers;