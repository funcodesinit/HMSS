

import payments from "@/app/api/apisauce/payments"
import { ActionTypes } from "../constants/action-types"
import billing from "@/app/api/apisauce/billing"
import orders from "@/app/api/apisauce/orders"

// export const fetchOrders = (options={}) => async (dispatch) => {
//     const user = await payments.list(options)
//     dispatch({
//         type: ActionTypes.SET_POS,
//         payload: user?.data
//     }) 
// } 
 
export const SetPosStats = () => (dispatch, getState) => {
    const posList = getState().payment.pos;
    if (!posList || posList.length === 0) {
      dispatch({
        type: ActionTypes.SET_POS_STATS,
        payload: {
          totalAmount: 0,
          uniqueGuestCount: 0,
          averageTransactionsPerGuest: 0,
          averageAmountPerGuest: 0,
        },
      });
      return;
    }

    const totalAmount = posList.reduce((sum, pos) => sum + pos.amount, 0);
    const uniqueGuestIds = [...new Set(posList.map(pos => pos.guestId))];
    const uniqueGuestCount = uniqueGuestIds.length;
    const averageTransactionsPerGuest = posList.length / uniqueGuestCount || 0;
    const averageAmountPerGuest = totalAmount / uniqueGuestCount || 0;
    
    dispatch({
      type: ActionTypes.SET_POS_STATS,
      payload: {
        totalAmount,
        uniqueGuestCount,
        averageTransactionsPerGuest: parseFloat(averageTransactionsPerGuest.toFixed(2)),
        averageAmountPerGuest: parseFloat(averageAmountPerGuest.toFixed(2)),
      },
    });
  };
  
export const fetchBills = (options={}) => async (dispatch) => {
    const user = await billing.list(options)
    dispatch({
        type: ActionTypes.SET_BILLS,
        payload: user?.data
    }) 
} 

export const fetchOrders = (options={}) => async (dispatch) => {
    const orderz = await orders.list(options)
    console.log("Orders fetched:", orderz)
    dispatch({
        type: ActionTypes.SET_ORDERS,
        payload: orderz?.data
    }) 
} 
