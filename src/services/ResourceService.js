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
      url: `/portal/resources`,
      params: params,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Create resource
   * @param {*} payload
   * @param {*} token
   * @returns
   */
  create: (payload, token) => {
    return axios({
      method: "POST",
      baseURL: url.resourceService,
      url: `/admin/resources`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Read resource
   * @param {*} resourceSlug 
   * @param {*} token 
   * @returns 
   */
  read: (resourceSlug, token) => {
    return axios({
      method: "GET",
      baseURL: url.resourceService,
      url: `/portal/resources/${resourceSlug}`,
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
      url: `/portal/resource-categories/all`,
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
      url: `/portal/resource-categories`,
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
  createCategory: (payload, token) => {
    return axios({
      method: "POST",
      baseURL: url.resourceService,
      url: `/admin/resource-categories`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Read resource category
   * @param {*} resourceCategoryId
   * @param {*} token
   * @returns
   */
  readCategory: (resourceCategoryId, token) => {
    return axios({
      method: "GET",
      baseURL: url.resourceService,
      url: `/portal/resource-categories/${resourceCategoryId}`,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Update resource category
   * @param {*} resourceCategoryId
   * @param {*} payload
   * @param {*} token
   * @returns
   */
  updateCategory: (resourceCategoryId, payload, token) => {
    return axios({
      method: "PUT",
      baseURL: url.resourceService,
      url: `/admin/resource-categories/${resourceCategoryId}`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
  },

  /**
   * Delete resource category
   * @param {*} resourceCategoryId
   * @param {*} token
   * @returns
   */
  deleteCategory: (resourceCategoryId, token) => {
    return axios({
      method: "DELETE",
      baseURL: url.resourceService,
      url: `/admin/resource-categories/${resourceCategoryId}`,
      headers: {
        Authorization: token,
      },
    });
  },
};
