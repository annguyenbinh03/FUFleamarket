import axiosClient from './axiosClient'

const END_POINT = {
    USERS : "user"
}

export const getAllUserAPI = () => {
    return axiosClient.get(`${END_POINT.USERS}/AllProfile(Admin)`);
}

