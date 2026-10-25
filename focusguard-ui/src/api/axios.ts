import axios from "axios";

import {
  getStorageItem,
} from "../utils/extensionStorage";


const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(

  async (
    config
  ) => {

    const token =
      await getStorageItem(
        "access_token"
      );


    const language =
      await getStorageItem(
        "language"
      );


    // ----------------------------------
    // AUTHORIZATION
    // ----------------------------------

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    // ----------------------------------
    // LANGUAGE
    //
    // Do not overwrite language if
    // the API call explicitly provides one.
    // ----------------------------------

    config.params = {

      language:
        config.params?.language ||
        language ||
        "en",

      ...config.params,

    };


    return config;

  }

);


export default api;