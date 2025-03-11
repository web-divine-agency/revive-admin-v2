import axios from "axios";
import { url } from "../config/app";

export default {
  /**
   * List permissions
   * @param {*} params 
   * @param {*} token 
   * @returns 
   */
  list: (params, token) => {
    return axios({
      method: "GET",
      baseURL: url.userService,
      url: `/admin/permissions`,
      params: params,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * List all permissions without pagination
   * @param {*} token 
   * @returns 
   */
  all: (token) => {
    return axios({
      method: "GET",
      baseURL: url.userService,
      url: `/admin/fn/permissions-all`,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Create permission
   * @param {*} payload 
   * @param {*} token 
   * @returns 
   */
  create: (payload, token) => {
    return axios({
      method: "POST",
      baseURL: url.userService,
      url: `/admin/permissions`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },
};