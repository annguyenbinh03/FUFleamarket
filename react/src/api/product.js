import axiosClient from './axiosClient'

const END_POINT = {
    PRODUCTS: "product",
    LIST_PRODUCT: "product/listproduct",
    ADMIN_LIST_PRODUCT: "product/admingetlistproducts",
    GET_PRODUCT_BY_ID: "product/getproductbyid",
    CREATE_PRODUCT: "product/createproductforsellers",
    GET_MY_PRODUCTS: "product/getmyproducts",
    ACCEPT_CREATE_PRODUCT_REQUEST : "product/adminacceptproductrequest",
    REJECT_CREATE_PRODUCT_REQUEST : "product/adminrejectproductrequest"
}


export const getProductAPI = () => {
  return axiosClient.get(`${END_POINT.LIST_PRODUCT}`);
};

export const getAdminProductAPI = (token ) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axiosClient.get(`${END_POINT.ADMIN_LIST_PRODUCT}`,config);
};

export const acceptCreateProductRequestAPI = (token, productId) => {
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
return axiosClient.put(`${END_POINT.ACCEPT_CREATE_PRODUCT_REQUEST}/${productId}`, null,config);
}

export const rejectCreateProductRequestAPI = (token, productId) => {
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
return axiosClient.put(`${END_POINT.REJECT_CREATE_PRODUCT_REQUEST}/${productId}`, null,config);
}




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





  