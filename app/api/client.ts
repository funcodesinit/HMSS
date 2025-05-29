import { create } from "apisauce";
const BASE_URL = process.env.NEXTAUTH_BACKEND_URL || "http://localhost:3000/";

const apiSause =  create({
	baseURL:   BASE_URL,
});

export default apiSause;

