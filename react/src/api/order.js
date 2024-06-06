import axiosClient from './axiosClient'

const END_POINT = {
    ORDER: "order",
    BUY_ORDER : "order/bought",
    SELL_ORDER : "order/sold",
    ACCEPT_ORDER_REQUEST : "order/acceptOrderRequest",                  
    DENY_ORDER_REQUEST : "order/denyOrderRequest",
}


export const createOrderAPI = (order, token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    return axiosClient.post(`${END_POINT.ORDER}`,order, config);
}

export const getBuyOrdersAPI = (token) => {
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  return axiosClient.get(`${END_POINT.BUY_ORDER}`, config);
}

export const getSellOrdersAPI = (token) => {
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  return axiosClient.get(`${END_POINT.SELL_ORDER}`, config);
}



export const acceptBuyRequestOrdersAPI = (token, productId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axiosClient.put(`${END_POINT.ACCEPT_ORDER_REQUEST}/${productId}`, null,config);
}

export const denyBuyRequestOrdersAPI = (token, productId) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
  return axiosClient.put(`${END_POINT.DENY_ORDER_REQUEST}/${productId}`, null,config);
}



