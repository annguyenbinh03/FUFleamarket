import axiosClient from './axiosClient'

const END_POINT = {
    CATEGORIES : "Category"
}

export const getCategoryAPI = () => {
    return axiosClient.get(`${END_POINT.CATEGORIES}`);
}

