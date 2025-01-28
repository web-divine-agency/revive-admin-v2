import axios from "axios";
import { url } from "../config/app";

export default {
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
  },

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
   * Create role
   * @param {*} payload
   * @returns
   */
  create: (payload, token) => {
    return axios({
      method: "POST",
      baseURL: url.userService,
      url: `/admin/res/roles`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },
};
