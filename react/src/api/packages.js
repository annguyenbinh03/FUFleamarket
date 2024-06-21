import axiosClient from './axiosClient'


const END_POINT = {
    PROMOTIONS: "promotion/InformationPromotion",
    VNPay : "VNPay/payment/"
}

export const getPackagesAPI = (token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    return axiosClient.get(`${END_POINT.PROMOTIONS}`,config);
  };


  export const getVNPayLinkAPI = (token, amount, infor) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    return axiosClient.get(`${END_POINT.VNPay}${amount}/${infor}`,config);
  };