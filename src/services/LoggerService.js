import axios from "axios";
import { url } from "../config/app";

export default {
  /**
   * List logs
   * @param {*} params
   * @param {*} token
   * @returns
   */
  list: (params, token) => {
    return axios({
      method: "GET",
      baseURL: url.loggerService,
      url: `/portal/res/logs`,
      params: params,
      headers: {
        Authorization: token,
      },
    });
  },
};
