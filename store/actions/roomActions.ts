
import rooms from "@/app/api/apisauce/rooms"
import { ActionTypes } from "../constants/action-types"
import reservations from "@/app/api/apisauce/reservations"
import { AppDispatch } from ".."

export const fetchRooms = (options={}) => async (dispatch:AppDispatch) => {
    const user = await rooms.list(options)
    dispatch({
        type: ActionTypes.SET_ROOMS,
        payload: user?.data
    }) 
} 


export const fetchReservations = (options={}) => async (dispatch:AppDispatch) => {
    const user = await reservations.list(options)
    dispatch({
        type: ActionTypes.SET_RESERVATIONS,
        payload: user?.data
    }) 
} 


export const fetchReservation = (id:any, options={}) => async (dispatch:AppDispatch) => {
    const res = await reservations.getDetails(id,options)
    dispatch({
        type: ActionTypes.SET_SELECTED_RESERVATION,
        payload: res?.data
    }) 
} 
