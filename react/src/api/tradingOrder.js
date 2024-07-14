import axiosClient from "./axiosClient";

const END_POINT = {
  GET_INFO_FOR_CREATE_ORDER_PAGE: "TradingOrder/getUserAndProductInfo",
  CREATE_TRADING_ORDER: "TradingOrder/createtradingordercombined",
  GET_MY_TRADING_ORDER: "TradingOrder/user1/TradingOrder",
  GET_MY_TRADING_ORDER_REQUEST : "TradingOrder/user2/TradingOrderRequest",
  USER2_ACCEPT_REQUEST : "TradingOrder/User2/Accept",
  USER2_REJECT_REQUEST : "TradingOrder/User2/Reject",
  USER1_COMPLETE_REQUEST : "TradingOrder/User1/Complete",
  USER1_REJECT_REQUEST : "TradingOrder/User1/Reject",
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
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.post(`${END_POINT.CREATE_TRADING_ORDER}`, data, config);
};

export const getMyTradingOrderAPI = (token, tab, sortBy) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get( `${END_POINT.GET_MY_TRADING_ORDER}?tab=${tab}&sortBy=${sortBy}`, config );
};


export const getMyTradingOrderRequestAPI = (token, tab, sortBy) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get( `${END_POINT.GET_MY_TRADING_ORDER_REQUEST}?tab=${tab}&sortBy=${sortBy}`, config );
};

export const user2AcceptRequest = (token, orderId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.post( `${END_POINT.USER2_ACCEPT_REQUEST}/${orderId}`, null, config );
};
export const user2RejectRequest = (token, orderId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.post( `${END_POINT.USER2_REJECT_REQUEST}/${orderId}`, null, config );
};


export const user1CompleteTradingRequest = (token, orderId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.post( `${END_POINT.USER1_COMPLETE_REQUEST}/${orderId}`, null, config );
};
export const user1RejectTradingRequest = (token, orderId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.post( `${END_POINT.USER1_REJECT_REQUEST}/${orderId}`, null, config );
};

