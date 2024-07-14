import axiosClient from "./axiosClient";

const END_POINT = {
  USERS_ORDER_TRANS: "promotiontransaction/getallpromotiontransactionofuser",
  ADMIN_PROMO_TRANSAC: "promotiontransaction/getallpromotiontransaction",
  GET_COUNT_PRODUCT_AND_LIMIT: "promotionOder/user/countproductandmaxlimit",
};

export const getUserPromoTransac = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(`${END_POINT.USERS_ORDER_TRANS}`, config);
};

export const getAdminAllPromoTransac = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(`${END_POINT.ADMIN_PROMO_TRANSAC}`, config);
};
export const getCountProductAndLimit = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(`${END_POINT.GET_COUNT_PRODUCT_AND_LIMIT}`, config);
};
