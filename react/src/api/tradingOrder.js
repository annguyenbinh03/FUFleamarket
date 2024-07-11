import axiosClient from "./axiosClient";

const END_POINT = {
  GET_INFO_FOR_CREATE_ORDER_PAGE: "TradingOrder/getUserAndProductInfo",
  CREATE_TRADING_ORDER : "TradingOrder/createtradingordercombined"
};

export const getInfoForCreateTradingOrder = (token, productId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  if (productId) {
    return axiosClient.get(
      `${END_POINT.GET_INFO_FOR_CREATE_ORDER_PAGE}/${productId}`,
      config
    );
  }
};

export const createTradingOrderAPI = (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axiosClient.post(`${END_POINT.CREATE_TRADING_ORDER}`,data, config);
}


