
import rooms from "@/app/api/apisauce/rooms"
import { ActionTypes } from "../constants/action-types"
import reservations from "@/app/api/apisauce/reservations"

export const fetchRooms = (options={}) => async (dispatch) => {
    const user = await rooms.list(options)
    dispatch({
        type: ActionTypes.SET_ROOMS,
        payload: user?.data
    }) 
} 


export const fetchReservations = (options={}) => async (dispatch) => {
    const user = await reservations.list(options)
    dispatch({
        type: ActionTypes.SET_RESERVATIONS,
        payload: user?.data
    }) 
} 


export const fetchReservation = (id:any, options={}) => async (dispatch) => {
    const res = await reservations.getDetails(id,options)
    dispatch({
        type: ActionTypes.SET_RESERVATIONS,
        payload: res?.data
    }) 
} 
