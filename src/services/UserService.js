import axios from "axios";
import { url } from "../config/app";

export default {
  /**
   * List users
   * @param {*} params
   * @param {*} token
   * @returns
   */
  list: (params, token) => {
    return axios({
      method: "GET",
      baseURL: url.userService,
      url: `/admin/users`,
      params: params,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Create user
   * @param {*} payload
   * @returns
   */
  create: (payload, token) => {
    return axios({
      method: "POST",
      baseURL: url.userService,
      url: `/admin/users`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Read user
   * @param {*} userId
   * @param {*} token
   * @returns
   */
  read: (userId, token) => {
    return axios({
      method: "GET",
      baseURL: url.userService,
      url: `/portal/users/${userId}`,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Update user
   * @param {*} userId
   * @param {*} payload
   * @param {*} token
   * @returns
   */
  update: (userId, payload, token) => {
    return axios({
      method: "PUT",
      baseURL: url.classService,
      url: `/portal/users/${userId}`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },
};
