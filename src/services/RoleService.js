import axios from "axios";
import { url } from "../config/app";

export default {
  /**
   * List roles
   * @param {*} params 
   * @param {*} token 
   * @returns 
   */
  list: (params, token) => {
    return axios({
      method: "GET",
      baseURL: url.userService,
      url: `/admin/res/roles`,
      params: params,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * List all roles without pagination
   * @param {*} token 
   * @returns 
   */
  all: (token) => {
    return axios({
      method: "GET",
      baseURL: url.userService,
      url: `/admin/fn/roles-all`,
      headers: {
        Authorization: token,
      },
    });
  }
};