import axios from "axios";

// this is an axios instance i.e., whenever we want to call an api we simply call this axios instance of method, endpoint and payload
export const axiosInstance = async (method, endpoint, payload) => {
  try {
    const response = await axios({
      method,
      url: endpoint,
      data: payload,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    return error;
  }
};
