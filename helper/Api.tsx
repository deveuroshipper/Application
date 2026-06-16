import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import axios from "axios";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";

export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const api = axios.create({ baseURL: BASE_URL, withCredentials: true });

const getAccessToken = () => {
  return AsyncStorage.getItem("access_token");
};
console.log("BASE_URL =", process.env.EXPO_PUBLIC_BASE_URL);

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

export const getTicketByIdApiHandler = async (id: string) => {
  try {
    const response = await api.get(`/tickets/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const sendTicketMessageApiHandler = async (
  id: string,
  message: string,
) => {
  try {
    const response = await api.post(`/tickets/${id}/messages`, { message });
    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const applyCouponApiHandler = async (data: any) => {
  try {
    const response = await api.post(`/coupons/apply`, data);
    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getCouponsApiHandler = async () => {
  try {
    const response = await api.get(`/coupons`);
    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const priceCalculationsApiHandler = async (
  orderId: string[],
  couponCode: any,
) => {
  try {
    console.log("payloed is : ", {
      orderIds: orderId,
      couponCode,
    });
    const response = await api.post(`/orders/calculate-multiple`, {
      orderIds: orderId,
      couponCode,
    });
    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getNotificationApiHandler = async () => {
  try {
    const response = await api.get(`/notifications`);
    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw error.response.data.message || "Check Network Connection";
  }
};

export const getAppTokenApiHandler = async () => {
  try {
    const response = await api.get(`/apptoken/get`);
    return response.data.data ?? response.data;
  } catch (error: any) {
    console.log(error.response?.data || error);
    throw error.response?.data?.message || "Check Network Connection";
  }
};

export const setAppTokenApiHandler = async (appToken: string) => {
  try {
    const response = await api.post(`/apptoken/set`, { appToken });
    return response.data.data ?? response.data;
  } catch (error: any) {
    console.log(error.response?.data || error);
    throw error.response?.data?.message || "Check Network Connection";
  }
};

export const notificationsStatusApiHandler = async () => {
  try {
    const response = await api.get(`/notifications/status`);
    return response.data.data ?? response.data;
  } catch (error: any) {
    console.log(error.response?.data || error);
    throw error.response?.data?.message || "Check Network Connection";
  }
};

export const readNotificationsApiHandler = async (
  notificationIds: string[],
) => {
  try {
    const response = await api.patch(`/notifications/read`, {
      notificationIds,
    });
    return response.data.data ?? response.data;
  } catch (error: any) {
    console.log(error.response?.data || error);
    throw error.response?.data?.message || "Check Network Connection";
  }
};

export const getDashboardImagesApiHandler = async () => {
  try {
    const response = await api.get(`/webcms/contents`);
    return response.data.data ?? response.data;
  } catch (error: any) {
    console.log(error.response?.data || error);
    throw error.response?.data?.message || "Check Network Connection";
  }
};

GoogleSignin.configure({
  webClientId:
    "757637884994-e25tj39trrsmir28oobf9p77tnb4lr51.apps.googleusercontent.com",
});
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    await GoogleSignin.signOut();
    const userInfo = await GoogleSignin.signIn();
    console.log("Google user:", userInfo);

    return userInfo;
  } catch (error: any) {
    console.log("Google error:", error);

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log("User cancelled Google login");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log("Google login already in progress");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log("Google Play Services not available");
    } else {
      console.log("Google login error:", error);
    }
  }
};

export const signInWithApple = async () => {
  if (Platform.OS !== "ios") {
    console.log("Apple login only works on iOS");
    return;
  }

  const isAvailable = await AppleAuthentication.isAvailableAsync();

  if (!isAvailable) {
    console.log("Apple login not available");
    return;
  }

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    console.log("Apple credential:", credential);

    const identityToken = credential.identityToken;
    const email = credential.email;
    const fullName = credential.fullName;

    // Send identityToken to your backend
    return credential;
  } catch (error: any) {
    if (error.code === "ERR_REQUEST_CANCELED") {
      console.log("User cancelled Apple login");
    } else {
      console.log("Apple login error:", error);
    }
  }
};

export const storeGoogleLoginApiHandler = async (data: any) => {
  try {
    const response = await api.post(`/auth/social-login`, data);
    return response.data.data ?? response.data;
  } catch (error: any) {
    console.log(error.response?.data || error);
    throw error.response?.data?.message || "Check Network Connection";
  }
};

export const getDurationApiHandler = async (id: any) => {
  try {
    const response = await api.get(`/shipping-rates/duration/${id}`);
    return response.data.data ?? response.data;
  } catch (error: any) {
    console.log(error.response?.data || error);
    throw error.response?.data?.message || "Check Network Connection";
  }
};

export const getContentApiHandler = async (type: string) => {
  try {
    const response = await api.get(`/cms-content/type/${type}`);
    return response.data.data ?? response.data;
  } catch (error: any) {
    console.log(error.response?.data || error);
    throw error.response?.data?.message || "Check Network Connection";
  }
};
