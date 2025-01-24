import axios from "axios";
import { url } from "../config/app";

export default {
  /**
   * Create user
   * @param {*} payload
   * @returns
   */
  create: (payload) => {
    return axios({
      method: "POST",
      baseURL: url.userService,
      url: `/admin/users`,
      data: payload,
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
      url: `/portal/res/users/${userId}`,
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
      url: `/portal/res/users/${userId}`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },
};
