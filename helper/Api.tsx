import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const api = axios.create({ baseURL: BASE_URL, withCredentials: true });

const getAccessToken = () => {
  return AsyncStorage.getItem("access_token");
};

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const res = await axios.post(
//           `${BASE_URL}/auth/refresh-token`,
//           {},
//           { withCredentials: true },
//         );

//         console.log("token from refresh token : ", res);

//         const newAccessToken = res.data.data.accessToken;
//         if (newAccessToken) {
//           localStorage.setItem("token", newAccessToken);
//           api.defaults.headers.common["Authorization"] =
//             `Bearer ${newAccessToken}`;
//           originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         }

//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh token failed:", refreshError);
//         localStorage.removeItem("userData");
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("internId");
//         localStorage.removeItem("signupPhone");
//         window.location.href = "/";
//       }
//     }

//     return Promise.reject(error);
//   },
// );

export const getProfileApiHandler = async () => {
  try {
    const response = await api.get(`/auth/me`);
    return response.data.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Check Network Connection";
    const err: any = new Error(message);
    err.status = status;
    throw err;
  }
};

export const loginApiHandler = async (email: String, password: String) => {
  try {
    const response = await api.post(`/auth/login`, {
      email,
      password,
    });
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getRoutesApiHandler = async () => {
  try {
    const response = await api.get(`/shipping-routes`);

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getCategoryApiHandler = async () => {
  try {
    const response = await api.get(`/categories`);

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};
