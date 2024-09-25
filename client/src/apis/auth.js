import axios from "axios";
const URL = import.meta.env.VITE_APP_AUTH_URL;
//console.log(URL)
export const login = async (formData) => {
    const res = await axios.post(`${URL}/login`, formData);
    return res; 
};

export const register = async (formData) => {
  const res = await axios.post(`${URL}/register`, formData);
  return res;
};
