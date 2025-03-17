import axios from "axios";
import { url } from "../config/app";

export default {
  /**
   * List branches without pagination
   * @param {*} token
   * @returns
   */
  all: (token) => {
    return axios({
      method: "GET",
      baseURL: url.branchService,
      url: `/portal/branches/all`,
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
      url: `/portal/branches`,
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
      url: `/admin/branches`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Read branch
   * @param {*} branchId
   * @param {*} params
   * @param {*} token
   * @returns
   */
  read: (branchId, params, token) => {
    return axios({
      method: "GET",
      baseURL: url.branchService,
      url: `/portal/branches/${branchId}`,
      params: params,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Update branch
   * @param {*} branchId
   * @param {*} payload
   * @param {*} token
   * @returns
   */
  update: (branchId, payload, token) => {
    return axios({
      method: "PUT",
      baseURL: url.branchService,
      url: `/admin/branches/${branchId}`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },
};
