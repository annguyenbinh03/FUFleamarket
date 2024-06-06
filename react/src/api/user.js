import axiosClient from './axiosClient'

const END_POINT = {
    USERS : "user"
}

export const getAllUserAPI = () => {
    return axiosClient.get(`${END_POINT.USERS}/AllProfile(Admin)`);
}




export const getUserProfileAPI = (token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    return axiosClient.get(`${END_POINT.USERS}/Profile`, config);
}

