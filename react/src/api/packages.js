import axiosClient from './axiosClient'


const END_POINT = {
    PROMOTIONS: "promotion/InformationPromotion",
}

export const getPackagesAPI = (token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    return axiosClient.get(`${END_POINT.PROMOTIONS}`,config);
  };