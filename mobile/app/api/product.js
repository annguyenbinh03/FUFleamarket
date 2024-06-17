import axiosClient from "./axiosClient";

const END_POINT = {
  PRODUCT: "product",
  PRODUCTS: "product",
  LIST_PRODUCT: "product/listproduct",
};

export const getProductAPI = () => {
  return axiosClient.get(`${END_POINT.LIST_PRODUCT}`);
};
