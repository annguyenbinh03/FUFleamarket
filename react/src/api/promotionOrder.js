import axiosClient from './axiosClient'

const END_POINT = {
    USERS_ORDER_TRANS : "promotiontransaction/getallpromotiontransactionofuser",
}

export const getUserPromoTransac = (token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    return axiosClient.get(`${END_POINT.USERS_ORDER_TRANS}`, config);
  }
  