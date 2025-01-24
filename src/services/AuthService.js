import axios from "axios";
import { url } from "../config/app";

export default {
  /**
   * Login user
   * @param {*} payload 
   * @returns 
   */
  login: (payload) => {
    return axios({
      method: "POST",
      baseURL: url.userService,
      url: `/login`,
      data: payload,
    });
  },

  /**
   * Check if user is authenticated
   * @param {*} token 
   * @returns 
   */
  authenticated: (token) => {
    return axios({
      method: "GET",
      baseURL: url.userService,
      url: `/authenticated`,
      headers: {
        Authorization: token,
      },
    });
  },
};
