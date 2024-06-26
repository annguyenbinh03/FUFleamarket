import axiosClient from './axiosClient'

const END_POINT = {
    USERS : "user",
    CHATTERS : "user/getlistsellerforchat",
    SHOP_PROFILE : "product/ShopProfile"
}

export const getAllUserAPI = () => {
    return axiosClient.get(`${END_POINT.USERS}/AllProfile(Admin)`);
}

export const getShopProfileAPI = (userId) => {
  return axiosClient.get(`${END_POINT.SHOP_PROFILE}?id=${userId}`);
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

