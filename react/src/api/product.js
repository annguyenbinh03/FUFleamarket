import axiosClient from './axiosClient'

const END_POINT = {
    PRODUCTS: "product",
    LIST_PRODUCT: "product/listproduct",
    GET_PRODUCT_BY_ID: "product/getproductbyid",
    CREATE_PRODUCT: "product/createproductforsellers",
    GET_MY_PRODUCTS: "product/getmyproducts"
}


export const getProductAPI = () => {
  return axiosClient.get(`${END_POINT.LIST_PRODUCT}`);
};


export const getProductByCategoryAPI = (categoryId) => {
  return axiosClient.get(`${END_POINT.LIST_PRODUCT}?CategoryId=${categoryId}`);
};



export const getProductByProductIdAPI = (productId) => {
  return axiosClient.get(`${END_POINT.GET_PRODUCT_BY_ID}/${productId}`);
};

export const createProductAPI = (product, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axiosClient.post(`${END_POINT.CREATE_PRODUCT}`,product, config);
}

export const getMyProductsAPI = ( token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axiosClient.get(`${END_POINT.GET_MY_PRODUCTS}`, config);
}



  