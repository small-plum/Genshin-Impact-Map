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

function mockMapPointDetail() {
  mock.mock(new RegExp(`${MainHost}/map/point/detail($|\\?.*)`), {
    code: 0,
    data: {
      correct_user_list: [
        {
          ctime: '2022-08-26 18:21:27',
          img: 'https://bbs-static.miyoushe.com/communityweb/avatar/avatar30038.png',
          name: 'Phoebe月光',
        },
        {
          ctime: '2022-08-26 18:21:27',
          img: 'https://bbs-static.miyoushe.com/communityweb/avatar/avatar30038.png',
          name: 'Phoebe月光',
        },
      ],
      info: {
        content: '七天神像(须弥 善见地)',
        img: 'https://webstatic.mihoyo.com/upload/wiki-ys-map/2022/08/24/305042811/de10f0ba4d8859bff2dfda5d0837b685_5896736996653532160.png',
      },
      last_update_time: '2022-08-26 18:21:27',
    },
    message: 'success',
  })
}

export function mockAllData() {
  mockLabelTree()
  mockMapAnchorList()
  mockMapPointDetail()
}
