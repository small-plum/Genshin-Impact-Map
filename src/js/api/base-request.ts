import axios, { type AxiosInstance } from 'axios'

export class BaseRequest {
  private axiosInst: AxiosInstance

  constructor(host: string) {
    this.axiosInst = axios.create({
      baseURL: host,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    })
  }

  // 发起请求
  sendRequest(
    method: string,
    path: string,
    params: any = null,
    data: any = null,
  ) {
    return this.axiosInst.request({ method, url: path, params, data })
  }
}

export const mainRequest = new BaseRequest('http://www.myhost.com/map')
