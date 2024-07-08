import axiosClient from "./axiosClient";

const END_POINT = {
  LIST_PRODUCT: "product/listproduct",
  CATEGORY: "category",
  PRODUCT_BY_ID: "product/getproductbyid",
  GET_MY_PRODUCTS: "product/getmyproducts",

  CREATE_PRODUCT: "product/createproductforsellers",

  ACCEPT_CREATE_PRODUCT_REQUEST: "product/adminacceptproductrequest",
  REJECT_CREATE_PRODUCT_REQUEST: "product/adminrejectproductrequest",

  INFOR_PRODUCT_BUY_REQUEST: "product/GetInforProductBuyRequest",

  ADMIN_PRODUCT_REQUEST: "product/adminliststatus0",
  ADMIN_PRODUCT_S12345: "product/adminliststatus1,2,3,4,5",
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
export const getAdminProductS123API = (token, status) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  if (status !== null) {
    return axiosClient.get(
      `${END_POINT.ADMIN_PRODUCT_S12345}&status=${status}`,
      config
    );
  }
  return axiosClient.get(`${END_POINT.ADMIN_PRODUCT_S12345}`, config);
};

export const getAdminProductRequestAPI = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.get(`${END_POINT.ADMIN_PRODUCT_REQUEST}`, config);
};
export const acceptCreateProductRequestAPI = (token, productId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.put(
    `${END_POINT.ACCEPT_CREATE_PRODUCT_REQUEST}/${productId}`,
    null,
    config
  );
};

export const rejectCreateProductRequestAPI = (token, productId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosClient.put(
    `${END_POINT.REJECT_CREATE_PRODUCT_REQUEST}/${productId}`,
    null,
    config
  );
};
