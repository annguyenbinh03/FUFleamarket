import axiosClient from './axiosClient'

const END_POINT = {
    USERS : "user",
    CHATTERS : "user/getlistsellerforchat",
    SHOP_PROFILE : "product/ShopProfile",
    ADMIN_GET_ALL_PROFILE : "user/AllProfile(Admin)",
    EDIT_USER_PROFILE: "user/UpdateProfileOfUser"
}

export const getAllUserAPI = () => {
    return axiosClient.get(`${END_POINT.ADMIN_GET_ALL_PROFILE}`);
}

export const getShopProfileAPI = (userId) => {
  return axiosClient.get(`${END_POINT.SHOP_PROFILE}?id=${userId}`);
}

export const editUserProfileAPI = (token, user) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axiosClient.put(`${END_POINT.EDIT_USER_PROFILE}`, user, config);
}

export const getChattersAPI = (token) => {
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  return axiosClient.get(`${END_POINT.CHATTERS}`, config);
}





export const getUserProfileAPI = (token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    return axiosClient.get(`${END_POINT.USERS}/Profile`, config);
}

