import client from "../client";

const basePath =
  process.env.NEXT_API_FRONTDESK_PATH?.startsWith('http')
    ? process.env.NEXT_API_FRONTDESK_PATH
    : `${process.env.NEXTAUTH_BACKEND_URL || ''}/${process.env.NEXT_API_FRONTDESK_PATH || 'frontdesk/guests/api'}`

const list = async (options = {}) => {
  return client.get(
    `${basePath}`,
    {
      ...options,
      headers: {
        Accept: "application/json"
      }
    }
  );
};

<<<<<<< HEAD
const getDetails = async (id: any, options = {}) => {
  return client.get(
    `frontdesk/guests/${id}/api`,
=======
const get = async (id: any, options = {}) => {
  return client.get(
    `${basePath}/${id}`,
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
    {
      ...options,
      headers: {
        "Accept": "application/json"
      }
    }
  );
};

<<<<<<< HEAD
 

export default {
  list,
  getDetails, 
=======
const create = async (data: any, options = {}) => {
  return client.post(basePath, data, {
    ...options,
    headers: {
      Accept: "application/json"
    }
  });
};

export default {
  list,
  get,
  create,

>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
};
