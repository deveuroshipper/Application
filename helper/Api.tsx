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
    const message =
      error?.response?.data?.message || "Check Network Connection";
    const err: any = new Error(message);
    err.status = status;
    throw err;
  }
};

export const registerApiHandler = async (
  name: string,
  email: string,
  password: string,
  mobile: string,
) => {
  try {
    const response = await api.post(`/auth/register`, {
      fullName: name,
      email,
      password,
      phone: mobile,
    });
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response?.data?.message || "Check Network Connection";
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

export const verificationApiHandler = async (email: String, code: String) => {
  try {
    const response = await api.post(`/auth/verify-otp`, {
      email,
      code,
    });

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const resentOtpApiHandler = async (email: String) => {
  try {
    const response = await api.post(`/auth/resend-otp`, {
      email,
    });
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const forgotPasswordApiHandler = async (email: String) => {
  try {
    const response = await api.post(`/auth/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const forgotPasswordOtpVerifyApiHandler = async (
  email: String,
  code: String,
) => {
  try {
    const response = await api.post(`/auth/verify-otp`, {
      email,
      code,
      isForget: true,
    });
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const resetPasswordOtpVerifyApiHandler = async (
  resetToken: String,
  password: String,
  confirmPassword: Boolean,
) => {
  try {
    const response = await api.post(`/auth/reset-password`, {
      resetToken,
      password,
      confirmPassword,
    });
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getRoutesApiHandler = async () => {
  try {
    const response = await api.get(`/shipping-routes/active`);

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

export const createNewAddressApiHandler = async (data: any) => {
  try {
    const response = await api.post(`/addresses/create`, data);

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getAddressApiHandler = async () => {
  try {
    const response = await api.get(`/addresses/get`);

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getAddressByIdApiHandler = async (id: string) => {
  try {
    const response = await api.get(`/addresses/getone/${id}`);

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const updateAddressApiHandler = async (id: string, data: any) => {
  try {
    const response = await api.patch(`/addresses/update/${id}`, data);

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const deleteAddressApiHandler = async (id: string) => {
  try {
    const response = await api.delete(`/addresses/delete/${id}`);

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getBoxesApiHandler = async (id: any) => {
  try {
    const response = await api.get(`boxes/route?routeId=${id}`);

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const submitEnquiryApiHandler = async (data: any) => {
  try {
    const response = await api.post(`/enquiries`, data);

    console.log(response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const createOrderApiHandler = async (data: any) => {
  try {
    const response = await api.post(`/orders`, data);

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getWarehouseApiHandler = async (id: any) => {
  try {
    const response = await api.get(`/warehouses/route/${id}`);

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getOrderByIdApiHandler = async (id: any) => {
  try {
    const response = await api.get(`/orders/${id}`);

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getCartApiHandler = async () => {
  try {
    const response = await api.get(`/carts/get`);

    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const addToCartApiHandler = async (id: any) => {
  try {
    const response = await api.post(`/carts/add`, {
      orderId: id,
    });

    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const removeFromCartApiHandler = async (id: string) => {
  try {
    const response = await api.delete(`/carts/remove/${id}`);

    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const submitServiceQueryApiHandler = async (data: any) => {
  try {
    const response = await api.post(`/webcms`, data);

    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const updateNameApiHandler = async (data: any) => {
  try {
    const response = await api.patch(`/users/updatename`, data);

    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const updateInfoApiHandler = async (data: any) => {
  try {
    const response = await api.post(`/users/updateinfo`, data);

    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};
export const verifyUpdateInfoApiHandler = async (data: any) => {
  try {
    const response = await api.post(`/users/verifyinfo`, data);

    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const changePasswordApiHandler = async (data: any) => {
  try {
    const response = await api.patch(`/users/changepassword`, data);

    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getOrdersApiHandler = async () => {
  try {
    const response = await api.get(`/orders/my`);

    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const orderTrackingApiHandler = async (id: any) => {
  try {
    const response = await api.get(`/orders/timeline/${id}`);

    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const createTicketApiHandler = async (data: any) => {
  try {
    const response = await api.post(`/tickets`, data);
    console.log(response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};


export const getTicketsApiHandler = async () => {
  try {
    const response = await api.get(`/tickets`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};
