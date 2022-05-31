import axios from "axios";
const AxiosInstance = axios.create({
    baseURL : process.env.REACT_APP_API_SERVER
  })

export default AxiosInstance