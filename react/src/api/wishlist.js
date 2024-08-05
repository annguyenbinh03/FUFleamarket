import axiosClient from './axiosClient'

const END_POINT = {
    ADD_PRODUCT : "Wishlist",
    GET_MY_WISH_LIST : "Wishlist/user",
    REMOVE_PRODCUCT : "Wishlist"
}

export const addProductToWishlistAPI = (wishlistDto, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axiosClient.post(`${END_POINT.ADD_PRODUCT}`,wishlistDto, config);
}

export const getMyWishlist = (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return axiosClient.get(`${END_POINT.GET_MY_WISH_LIST}`, config);
  }

  export const deleteFavouriteProduct = (token, productId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return axiosClient.delete(`${END_POINT.REMOVE_PRODCUCT}/${productId}`, config);
  }