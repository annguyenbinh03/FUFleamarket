import axiosClient from './axiosClient'

const END_POINT = {
    PRODUCTS: "product"
}

export const getProductAPI = () => {
    return axiosClient.get(`${END_POINT.PRODUCTS}`);
}

export const getProductByCategoryAPI = (categoryId) => {
    return axiosClient.get(`${END_POINT.PRODUCTS}?CategoryId=${categoryId}`);
}


// export const delTodosAPI = (id) => {
//     return axiosClient.delete(`${END_POINT.TODOS}/${id}`);
// }

// export const addTodosAPI = (todo) => {
//     return axiosClient.post(`${END_POINT.TODOS}`,todo);
// }

// export const editTodosAPI = (todo) => {
//     return axiosClient.put(`${END_POINT.TODOS}`,todo);
// }

