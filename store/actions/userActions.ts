import userz from "@/app/api/apisauce/userz"
import { ActionTypes } from "../constants/action-types"
import guests from '@/app/api/apisauce/guests'
import { AppDispatch } from ".."

export const fetchGuests = (options={}) => async (dispatch:AppDispatch) => {
    const user = await guests.list(options)
    dispatch({
        type: ActionTypes.SET_GUESTS,
        payload: user?.data
    }) 
} 

export const fetchGuest = (id:any,options = {}) => async (dispatch:AppDispatch) => { 
    const userList = await guests.getDetails(id, options); 
 
    dispatch ({
        type: ActionTypes.SET_SELECTED_GUESTS,
        payload: userList?.data
    }) 
}


export const fetchUsers = (options={}) => async (dispatch:AppDispatch) => {
    const user = await userz.list(options);
    dispatch({
        type: ActionTypes.SET_USERS,
        payload: user?.data
    }) 
} 

export const fetchUser = (id:any,options = {}) => async (dispatch:AppDispatch) => {
    const user = await userz.getDetails(id, options);
    dispatch({
        type: ActionTypes.SET_SELECTED_USER,
        payload: user?.data
    }) 
} 

 