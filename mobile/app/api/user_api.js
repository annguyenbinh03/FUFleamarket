import axiosClient from "./axiosClient";

const END_POINT = {
  USERS: "user",
  CHATTERS: "user/getlistsellerforchat",
  SHOP_PROFILE: "product/ShopProfile",
  ADMIN_GET_ALL_PROFILE: "user/AllProfile(Admin)",
  EDIT_USER_PROFILE: "user/UpdateProfileOfUser",
  LOGIN_ADMIN: "LoginAdmin/login",
};

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const user_login = (data) => {
  return axiosClient.post(END_POINT.LOGIN_ADMIN, data);
};

export const getAllUserAPI = () => {
  return axiosClient.get(END_POINT.ADMIN_GET_ALL_PROFILE);
};

export const getShopProfileAPI = (userId) => {
  return axiosClient.get(`${END_POINT.SHOP_PROFILE}?id=${userId}`);
};

export const editUserProfileAPI = (token, user) => {
  return axiosClient.put(END_POINT.EDIT_USER_PROFILE, user, getConfig(token));
};

export const getChattersAPI = (token) => {
  return axiosClient.get(END_POINT.CHATTERS, getConfig(token));
};
