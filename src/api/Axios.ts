import axios from "axios";
import config from "../config";

export const Axios = axios.create({
  baseURL: config.BaseApiURl,
  withCredentials: true,
});
