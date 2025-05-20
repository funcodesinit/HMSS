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
    // const userList = await guest.get(id, options); 
    dispatch ({
        type: ActionTypes.SET_SELECTED_GUESTS,
        // payload: userList?.data?.users
    }) 
}
