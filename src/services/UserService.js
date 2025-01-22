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
};