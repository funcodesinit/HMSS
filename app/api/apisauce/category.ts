 
import client from "../client"; 

const list = async (options = {}) => {
    return client.get(
        `frontdesk/products/api/category`,
        {
            ...options,
            headers:{
                "Accept":"Aplication/json"
            }
        }
    );
};

 
export default {
    list,
};
