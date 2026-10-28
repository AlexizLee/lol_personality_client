import { axios } from '../axios/axios'

export const getGameplayInfo = (payload) => {
    console.log(payload);
    return axios.get('gameplay/info', { params: payload })
    .then(({data}) => {
        return Promise.resolve(data)
    })
    .catch((err) => {
        return Promise.reject(err)
    })
}