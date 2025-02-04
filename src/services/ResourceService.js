import axios from "axios";
import { url } from "../config/app";

export default {
  /**
   * List resources
   * @param {*} params
   * @param {*} token
   * @returns
   */
  list: (params, token) => {
    return axios({
      method: "GET",
      baseURL: url.resourceService,
      url: `/admin/res/resources`,
      params: params,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * List all resources categories pagination
   * @param {*} token 
   * @returns 
   */
  allCategories: (token) => {
    return axios({
      method: "GET",
      baseURL: url.resourceService,
      url: `/admin/fn/resource-categories-all`,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * List resource categories
   * @param {*} params
   * @param {*} token
   * @returns
   */
  listCategories: (params, token) => {
    return axios({
      method: "GET",
      baseURL: url.resourceService,
      url: `/admin/res/resource-categories`,
      params: params,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Create resource category
   * @param {*} payload
   * @param {*} token
   * @returns
   */
  createCategories: (payload, token) => {
    return axios({
      method: "POST",
      baseURL: url.resourceService,
      url: `/admin/res/resource-categories`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },
};
