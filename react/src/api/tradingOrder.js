import axiosClient from "./axiosClient";

const END_POINT = {
  GET_INFO_FOR_CREATE_ORDER_PAGE: "TradingOrder/getUserAndProductInfo",
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
