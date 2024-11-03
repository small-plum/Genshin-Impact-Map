import { mainRequest } from './base-request'

export function getMapFilterTree() {
  return mainRequest.sendRequest('get', '/label/tree')
}
