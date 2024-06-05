import axiosClient from './axiosClient';

const END_POINTS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  DELETED: "deleted"
}

export const getProductPendingAPI = () => {
  return axiosClient.get(`/api/product/admin/${END_POINTS.PENDING}`);
};

export const getProductConfirmedAPI = () => {
  return axiosClient.get(`/api/product/admin/${END_POINTS.CONFIRMED}`);
};

export const getProductDeletedAPI = () => {
  return axiosClient.get(`/api/product/admin/${END_POINTS.DELETED}`);
};


  
  // export const approveProductAPI = (productId) => {
  //   return axiosClient.put(`${END_POINT.PRODUCTS}/${productId}/approve`);
  // };
  
  // export const rejectProductAPI = (productId) => {
  //   return axiosClient.put(`${END_POINT.PRODUCTS}/${productId}/reject`);
  // };