import axiosClient from './axiosClient';

const END_POINTS = {
  TOP_SELLING_PRODUCT: "DashBoard/topsellingproducts",
  SUMMARY : "DashBoard/dashboardsummary",
  TOP_SELLER : "DashBoard/topsellers",
  MONTHY_PACKAGES : "DashBoard/packagemonthlydata"
}

export const getTopSellingProductAPI = () => {
  return axiosClient.get(`/${END_POINTS.TOP_SELLING_PRODUCT}`);
};

export const getTopSellerAPI = () => {
  return axiosClient.get(`/${END_POINTS.TOP_SELLER}`);
};

export const getMonthlyPackageAPI = () => {
  return axiosClient.get(`/${END_POINTS.MONTHY_PACKAGES}`);
};






export const getSummaryAPI = () => {
  return axiosClient.get(`/${END_POINTS.SUMMARY}`);
};



  
  // export const approveProductAPI = (productId) => {
  //   return axiosClient.put(`${END_POINT.PRODUCTS}/${productId}/approve`);
  // };
  
  // export const rejectProductAPI = (productId) => {
  //   return axiosClient.put(`${END_POINT.PRODUCTS}/${productId}/reject`);
  // };