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

const get = async (id: any, options = {}) => {
  return client.get(
    `${basePath}/${id}`,
    {
      ...options,
      headers: {
        "Accept": "application/json"
      }
    }
  );
};

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

};
