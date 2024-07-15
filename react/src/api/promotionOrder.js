import axiosClient from './axiosClient'

const END_POINT = {
    USERS_ORDER_TRANS : "promotiontransaction/getallpromotiontransactionofuser",
    ADMIN_PROMO_TRANSAC : "promotiontransaction/getallpromotiontransaction",
}

export const getUserPromoTransac = (token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    return axiosClient.get(`${END_POINT.USERS_ORDER_TRANS}`, config);
  }
  
  export const getAdminAllPromoTransac = (token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    return axiosClient.get(`${END_POINT.ADMIN_PROMO_TRANSAC}`, config);
  }
  