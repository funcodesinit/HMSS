<<<<<<< HEAD
=======
import { prisma } from "@/lib/prisma"
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
import { ActionTypes } from "../constants/action-types"
import guests from '@/app/api/apisauce/guests'

export const fetchGuests = (options={}) => async (dispatch) => {
    const user = await guests.list(options)
    dispatch({
        type: ActionTypes.SET_GUESTS,
        payload: user?.data
    }) 
} 

export const fetchGuest = (id:any,options = {}) => async (dispatch) => { 
<<<<<<< HEAD
    const userList = await guests.getDetails(id, options); 
    console.log('-----userList--------', userList)
    dispatch ({
        type: ActionTypes.SET_SELECTED_GUESTS,
        payload: userList?.data
=======
    // const userList = await guest.get(id, options); 
    dispatch ({
        type: ActionTypes.SET_SELECTED_GUESTS,
        // payload: userList?.data?.users
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
    }) 
}
