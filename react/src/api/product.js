import axiosClient from './axiosClient'

const END_POINT = {
    PRODUCTS: "product",
    LIST_PRODUCT: "product/listproduct",
    GET_PRODUCT_BY_ID: "product/getproductbyid"
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

// export const delTodosAPI = (id) => {
//     return axiosClient.delete(`${END_POINT.TODOS}/${id}`);
// }

// export const addTodosAPI = (todo) => {
//     return axiosClient.post(`${END_POINT.TODOS}`,todo);
// }

// export const editTodosAPI = (todo) => {
//     return axiosClient.put(`${END_POINT.TODOS}`,todo);
// }

  


  