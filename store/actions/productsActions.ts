import products from "@/app/api/apisauce/products";
import { ActionTypes } from "../constants/action-types"
import category from "@/app/api/apisauce/category";
import { Anybody } from "next/font/google";
import { AppDispatch } from "..";

// redux thunk api calls 
export const fetchPublicProductList = (options = {}) => async (dispatch:AppDispatch) => {
    try {
        const productsList = await products.list(options);
        dispatch({
            type: ActionTypes.SET_PRODUCTS,
            payload: productsList?.data
        });
    } catch (error:any) {
        console.error("Error fetching product list:", error);
        dispatch({
            type: ActionTypes.SET_FETCH_ERROR,
            payload: error?.message || 'server error. Unable to fetch data from server',
        });
    }
};

export const fetchPublicCategoryList = () => async (dispatch:AppDispatch) => {
    try {
        const prod = await category?.list();
        dispatch({
            type: ActionTypes.SET_CATEGORY,
            payload: prod?.data
        });
    } catch (error:any) {
        console.error("Error fetching product list:", error);
        dispatch({
            type: ActionTypes.SET_FETCH_ERROR,
            payload: error?.message || 'server error. Unable to fetch data from server',
        });
    }
};

// export const fetchPublicProductDetails = (id) => async (dispatch) => {
//     try {
//         const prod = await payments.getDetails(id);
        
//         dispatch({
//             type: ActionTypes.SET_SELECTED_PRODUCT,
//             payload: prod?.data
//         });
//     } catch (error) {
//         console.error("Error fetching product list:", error);
//         dispatch({
//             type: ActionTypes.SET_FETCH_ERROR,
//             payload: error?.message || 'server error. Unable to fetch data from server',
//         });
//     }
// };



// // sizes  
// export const fetchPublicSizesList = () => async (dispatch) => {
//     try {
//         const prod = await sizes?.getListing();
//         dispatch({
//             type: ActionTypes.SET_PRODUCT_SIZES,
//             payload: prod?.data
//         });
//     } catch (error) {
//         console.error("Error fetching product list:", error);
//         dispatch({
//             type: ActionTypes.SET_FETCH_ERROR,
//             payload: error?.message || 'server error. Unable to fetch data from server',
//         });
//     }
// };

// // redux calls ?//
// export const setProductCategory = (data) => {
//     return {
//         type: ActionTypes.SET_PRODUCT_CATEGORY,
//         payload: data
//     }
// }
  
// export const setProductSizes = (data) => {
//     return {
//         type: ActionTypes.SET_PRODUCT_SIZES,
//         payload: data
//     }
// }
 
// export const setSelectedProduct = (data) => {
//     return {
//         type: ActionTypes.SET_SELECTED_PRODUCT,
//         payload: data
//     }
// }
 
// export const setSelectedCategory = (data) => {
//     return {
//         type: ActionTypes.SET_SELECTED_CATEGORY,
//         payload: data
//     }
// }
