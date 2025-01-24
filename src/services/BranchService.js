import axios from "axios";
import { url } from "../config/app";

export default {
  /**
   * List branches
   * @param {*} params 
   * @param {*} token 
   * @returns 
   */
  list: (params, token) => {
    return axios({
      method: "GET",
      baseURL: url.userService,
      url: `/portal/res/branches`,
      params: params,
      headers: {
        Authorization: token,
      },
    });
  },
};
