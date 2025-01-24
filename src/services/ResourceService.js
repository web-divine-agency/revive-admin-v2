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
      baseURL: url.userService,
      url: `/portal/res/resources`,
      params: params,
      headers: {
        Authorization: token,
      },
    });
  },
};
