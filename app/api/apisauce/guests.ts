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

const getDetails = async (id: any, options = {}) => {
  return client.get(
    `/frontdesk/guests/${id}/api`,
    {
      ...options,
      headers: {
        "Accept": "application/json"
      }
    }
  );
};
 
export default {
  list,
  getDetails,

};
