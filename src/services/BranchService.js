import axios from "axios";
import { url } from "../config/app";

export default {
  /**
   * List all branches without pagination
   * @param {*} token 
   * @returns 
   */
  all: (token) => {
    return axios({
      method: "GET",
      baseURL: url.branchService,
      url: `/admin/fn/branches-all`,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * List branches
   * @param {*} params
   * @param {*} token
   * @returns
   */
  list: (params, token) => {
    return axios({
      method: "GET",
      baseURL: url.branchService,
      url: `/admin/res/branches`,
      params: params,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Create branch
   * @param {*} payload
   * @param {*} token
   * @returns
   */
  create: (payload, token) => {
    return axios({
      method: "POST",
      baseURL: url.branchService,
      url: `/admin/res/branches`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },
};
