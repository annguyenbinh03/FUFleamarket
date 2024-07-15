import axiosClient from './axiosClient'

const END_POINT = {
    ORDER: "order",
    BUY_ORDER : "order/bought",
    SELL_ORDER : "order/sold",
    ACCEPT_ORDER_REQUEST : "order/acceptOrderRequest",                  
    DENY_ORDER_REQUEST : "order/denyOrderRequest", 
    REJECT_ORDER_REQUEST : "order/rejectOrder",
    REJECT_ORDER_REQUEST_BY_BUYER : "order/rejectOrderByBuyer",
    COMPLETE_ORDER : "order/completeOrder",
    MY_ORDER_REQUEST : "order/soldRequest",
    MY_SOLD_ORDER_HISTORY: "order/SoldStatus123",
    ADMIN_GET_ALL_ORDER : "order/admin/orders" 
}


export const createOrderAPI = (order, token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    return axiosClient.post(`${END_POINT.ORDER}`,order, config);
}

export const getBuyOrdersAPI = (token, tab, sortBy) => {
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  return axiosClient.get(`${END_POINT.BUY_ORDER}?sortBy=${sortBy}&tab=${tab}`, config);
}

export const getSellOrdersAPI = (token) => {
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  return axiosClient.get(`${END_POINT.MY_SOLD_ORDER_HISTORY}`, config);
}

export const getMySellOrdersRequestAPI = (token,sortBy,productId, tab) => {
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    if(productId !== null){
      return axiosClient.get(`${END_POINT.MY_ORDER_REQUEST}?sortBy=${sortBy}&productId=${productId}&tab=${tab}`, config);
    }else{
      return axiosClient.get(`${END_POINT.MY_ORDER_REQUEST}?sortBy=${sortBy}&tab=${tab}`, config);
    }
 
}

export const getAdminAllOrders = (token) => {
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
return axiosClient.get(`${END_POINT.ADMIN_GET_ALL_ORDER}`,config);
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


export const rejectBuyRequestOrdersAPI = (token, productId) => {
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
return axiosClient.put(`${END_POINT.REJECT_ORDER_REQUEST}/${productId}`, null,config);
}

export const rejectBuyRequestOrdersByBuyerAPI = (token, productId) => {
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
return axiosClient.put(`${END_POINT.REJECT_ORDER_REQUEST_BY_BUYER}/${productId}`, null,config);
}

export const completeOrdersByBuyerAPI = (token, productId) => {
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
return axiosClient.put(`${END_POINT.COMPLETE_ORDER}/${productId}`, null,config);
}




