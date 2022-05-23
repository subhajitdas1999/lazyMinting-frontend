import axios from "axios";
const AxiosInstance = axios.create({
    withCredentials: true,
    baseURL : process.env.REACT_APP_API_SERVER
  })

export default AxiosInstance