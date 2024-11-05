import mock from 'mockjs'
import { MainHost } from '../api/constants'
import { LabelTreeData } from './label-tree-data'
import { MapAnchorList } from './map-anchor-list'

function mockLabelTree() {
  mock.mock(new RegExp(`${MainHost}/label/tree($|\\?.*)`), {
    code: 0,
    data: LabelTreeData,
    message: 'success',
  })
}

function mockMapAnchorList() {
  mock.mock(new RegExp(`${MainHost}/map_anchor/list($|\\?.*)`), {
    code: 0,
    data: MapAnchorList,
    message: 'success',
  })
}

export function mockAllData() {
  mockLabelTree()
  mockMapAnchorList()
}
