import { openNotificationWithIcon } from './notification_antd';

const axios = require('axios')
/* ... */

const apiClientUrlencoded = {
  post: (url, data = {}) => {
    return axios.post(url, data, {
      headers: {
        'Authorization': 'Basic ZDU1ZDk1MjYtYmI4OC00Njg3LWE3ZjMtMGU1MmNlNDgwZDk0OjUxNmQwMWYwLWVkN2QtNDI3Mi1hZDJjLTc4YTBlYzAyOGQ2MQ==',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data,
    })
      .then((result) => {
        // Do somthing
        console.log('fndsdg234', result);
      })
      .catch((err) => {
        console.log('dsfgdfg', err)
        // Do somthing
      })
  }
};


export const refreshToken = ({ token }) => {
  const paramsToken = new URLSearchParams()
  paramsToken.append('grant_type', 'refresh_token')
  paramsToken.append('refresh_token', token);
  console.log('token==000', token)
  return apiClientUrlencoded.post('https://api.lctech.vn/oauth/token', paramsToken)
}
// 
// reset device data
// method: 'POST'
// url: 'https://api.lctech.vn/api/device/reset'
// headers: {
//   'Authorization': 'Bearer access_token_moi'
// }
// form_data: {
//   'DevAddr': 'E8DB84994710', // device mac address
//   'payload': '550001',
//   'isHex': 'on',
// }


const request = axios.create({
  baseURL: 'https://api.lctech.vn/api',
  timeout: 25000,
});

// Add a request interceptor
request.interceptors.request.use(
  async (config) => {
    const access_token = await localStorage.getItem('ACCESS_TOKEN_lctech')
    // const access_token = '19edc127383d71e7168fab691872450ffbc71357';
    if (access_token)
      config.headers["Authorization"] = `Bearer ${access_token}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
// {
// {access_token: "491c7319a697bd2d343482edfd7fd14e94b151eb", token_type: "Bearer", expires_in: 3599,…}
// access_token: "491c7319a697bd2d343482edfd7fd14e94b151eb"
// expires_in: 3599
// refresh_token: "2337c8c598d264c4d479157fa5799888c948e2ab"
// token_type: "Bearer"
// Add a response interceptor
request.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error?.response?.config;
    if (error?.response?.status === 401) {
      const refresh_token = await localStorage.getItem('refresh_token_lctech')|| '2337c8c598d264c4d479157fa5799888c948e2ab'
      // const refresh_token = '665d356b9b0deee28c7f28dce270a6e5f6c6bab9';
      return (
        refreshToken({ token: refresh_token }).then(async (res) => {
          if (res.status === 200) {
            console.log(res ,'res0d0d0d0d0')
            await localStorage.setItem('ACCESS_TOKEN_lctech', res.data.access_token);
            await localStorage.setItem('refresh_token_lctech', res.data.refresh_token);
            request.defaults.headers.common["Authorization"] = `Bearer ${res.data.access_token}`;
            return request(originalRequest);
          }
        }).catch((err) => {
          return Promise.reject(err);
        })
      );
    }
    return Promise.reject(error);
  }
);

// 'DevAddr': 'E8DB84994710', // device mac address
// 'payload': '550001',
// 'isHex': 'on',
const convertFromData = (obj) => {
  const paramsToken = new FormData();
  Object.keys(obj).map(key => paramsToken.append(key, obj[key]))
  return paramsToken;
}
const dataBody = {
  'DevAddr': 'E8DB84994710', // device mac address
  'payload': '550001',
  'isHex': 'on',
}
export const resetDeviceData = (data) => {
  // return request({
  //   method: "post",
  //   url: 'device/reset',
  //   data: convertFromData(dataBody),
  // })
  //   .then(() => {
  //     openNotificationWithIcon('success', 'Reset devices success')
  //   })
  //   .catch(err => {
  //     alert(JSON.stringify(err))
  //   })
}