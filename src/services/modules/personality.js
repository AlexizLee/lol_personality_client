import { axios } from '../axios/axios'

export const getPersonalityInfo = (payload) => {
    console.log(payload);
    return axios.get('personality/info', { params: payload })
    .then(({data}) => {
        return Promise.resolve(data)
    })
    .catch((err) => {
        return Promise.reject(err)
    })
}