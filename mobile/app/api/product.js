import axiosClient from "./axiosClient";

const END_POINT = {
  LIST_PRODUCT: "product/ListProduct",
  CATEGORY: "category",
  PRODUCT_BY_ID: "product/GetProductById",
  GET_MY_PRODUCTS: "product/getmyproducts",

  CREATE_PRODUCT: "product/createproductforsellers",

  ACCEPT_CREATE_PRODUCT_REQUEST: "product/adminacceptproductrequest",
  REJECT_CREATE_PRODUCT_REQUEST: "product/adminrejectproductrequest",

  INFOR_PRODUCT_BUY_REQUEST: "product/GetInforProductBuyRequest",

  ADMIN_PRODUCT_REQUEST: "product/adminliststatus0",
  ADMIN_PRODUCT_S123: "product/adminliststatus1,2,3",
};
const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getProductAPI = () => {
  console.log("Calling API:", END_POINT.LIST_PRODUCT);
  return axiosClient.get(END_POINT.LIST_PRODUCT);
};

export const getCategoriesAPI = () => {
  return axiosClient.get(END_POINT.CATEGORY);
};
export const getProductByIdAPI = (productId) => {
  return axiosClient.get(`${END_POINT.PRODUCT_BY_ID}/${productId}`);
};
export const getMyProductsAPI = () => {
  return axiosClient.get(END_POINT.GET_MY_PRODUCTS);
};
export const createProductAPI = (product, token) => {
  return axiosClient.post(END_POINT.CREATE_PRODUCT, product, getConfig(token));
};
