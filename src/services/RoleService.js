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
      url: `/admin/roles`,
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
      url: `/admin/roles`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Read role
   * @param {*} roleId
   * @param {*} token
   * @returns
   */
  read: (roleId, token) => {
    return axios({
      method: "GET",
      baseURL: url.userService,
      url: `/admin/roles/${roleId}`,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Update role
   * @param {*} roleId
   * @param {*} payload
   * @param {*} token
   * @returns
   */
  update: (roleId, payload, token) => {
    return axios({
      method: "PUT",
      baseURL: url.userService,
      url: `/admin/roles/${roleId}`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Delete role
   * @param {*} roleId
   * @param {*} token
   * @returns
   */
  delete: (roleId, token) => {
    return axios({
      method: "DELETE",
      baseURL: url.userService,
      url: `/admin/roles/${roleId}`,
      headers: {
        Authorization: token,
      },
    });
  },
};
