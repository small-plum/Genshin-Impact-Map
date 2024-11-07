import L from 'leaflet'
import {} from 'mockjs'
import { getMapPointDetail } from './api'

interface AreaNameConfig {
  lat: number
  lng: number
  name: string
  children: any[]
}
interface pointConfig {
  lat: number
  lng: number
  icon: string
  pointId: number
  name: string
}

export class MapManager {
  private map: L.Map
  private areaNameLayerGroup: L.LayerGroup | undefined
  private pointLayerGroup: L.LayerGroup | undefined
  private mapAnchorList: AreaNameConfig[] = []
  private prevZoom = 0
  private lastActivePointId = -1

  constructor(domId: string) {
    // 边界
    const bounds = L.latLngBounds(L.latLng(0, 0), L.latLng(-256, 256))
    this.map = L.map(domId, {
      maxBounds: bounds, //限制拖拽范围只有图片区域
      center: [-128, 128], // 设置中心点
      crs: L.CRS.Simple,
      attributionControl: false, //去掉右下角自带的属性
      zoomControl: false, //去掉自带的缩放按钮
      zoom: 5,
      maxZoom: 7, // 设置缩放的最大范围
      minZoom: 4, // 设置缩放的最小范围
    })

    this.prevZoom = this.map.getZoom()
    // @ts-ignore
    this.map.addControl(
      new L.Control.Zoomslider({
        position: 'bottomright',
        stepHeight: 30,
        knobHeight: 20,
      }),
    )

    L.tileLayer('images/map/{z}/{x}/{y}.png', {
      bounds, //限制不会请求负数的点位
      maxZoom: 7,
      minZoom: 4,
      noWrap: true,
    }).addTo(this.map)

    // 对重新渲染的情况进行优化，不是只要放大缩小就重新渲染
    this.map.on('zoom', () => {
      const prevRenderFlag = this.prevZoom >= 6
      const curRenderFlag = this.map.getZoom() >= 6
      if (prevRenderFlag !== curRenderFlag) {
        this.renderAreaName()
      }
      this.prevZoom = this.map.getZoom()
    })

    this.map.on('click', this.onMapClick.bind(this))
  }

  onMapClick() {
    const lastActivePoint = document.getElementById(
      `mapPointItem${this.lastActivePointId}`,
    )
    lastActivePoint?.classList.remove('active')
    this.lastActivePointId = -1
  }

  setMapAnchorList(configList: AreaNameConfig[]) {
    this.mapAnchorList = configList
  }
  // 渲染地名函数
  renderAreaName() {
    this.areaNameLayerGroup?.clearLayers()

    let markers: L.Marker[] = []
    // 大地图渲染到二级地名
    if (this.map.getZoom() >= 6) {
      this.mapAnchorList.forEach(val => {
        let childrenList: L.Marker[] = []
        childrenList = val.children.map(this.getAreaNameMarkerItem)
        markers = markers.concat(childrenList)
      })
    } else {
      // 小地图只需要渲染一级地名
      markers = this.mapAnchorList.map(this.getAreaNameMarkerItem)
    }

    this.areaNameLayerGroup = L.layerGroup(markers)
    this.areaNameLayerGroup.addTo(this.map)
  }
  // 获取地名
  getAreaNameMarkerItem(config: AreaNameConfig) {
    const { lat = 0, lng = 0, name } = config // 对象解构赋值
    return L.marker(L.latLng(lat, lng), {
      icon: L.divIcon({
        className: 'map-marker-item',
        html: `<div class="area-mark-item">${name}</div>`,
      }),
    })
  }
  // 渲染地图标点
  renderPoints(pointList: pointConfig[]) {
    this.pointLayerGroup?.clearLayers()
    const pointMarkers = pointList.map(val => {
      const { lat, lng, icon, pointId, name } = val // 对象解构赋值
      const marker = L.marker(L.latLng(lat, lng), {
        icon: L.divIcon({
          className: 'map-point-item',
          html: `<div class="point-item-container" id="mapPointItem${pointId}">
                <div class="point-pic" style="background-image: url(${icon})"></div>
                <div class="arrow-icon lt"></div>
                <div class="arrow-icon lb"></div>
                <div class="arrow-icon rb"></div>
                <div class="arrow-icon rt"></div>
                </div>`,
          iconSize: [37, 40],
          iconAnchor: [19, 20],
        }),
      })

      marker.bindPopup(
        L.popup({
          content: this.clacPopupContent({
            correct_user_list: [],
            info: {},
            last_update_time: '',
            name: '',
          }),
        }),
      )

      // 监听弹窗打开事件
      marker.on('popupopen', async () => {
        const res = await getMapPointDetail(pointId)
        const popupData = { ...res.data, name }
        marker.setPopupContent(this.clacPopupContent(popupData))
      })

      //监听点击事件打开弹窗
      marker.on('click', e => {
        if (this.lastActivePointId === pointId) return
        const lastActivePoint = document.getElementById(
          `mapPointItem${this.lastActivePointId}`,
        )
        lastActivePoint?.classList.remove('active')
        const curPoint = document.getElementById(`mapPointItem${pointId}`)
        curPoint?.classList.add('active')
        this.lastActivePointId = pointId
      })
      return marker
    })

    this.pointLayerGroup = L.layerGroup(pointMarkers)
    this.pointLayerGroup.addTo(this.map)
  }

  // 动态生成模板
  clacPopupContent(popupData: any) {
    const { correct_user_list, info, last_update_time, name } = popupData
    const avatarElmStr = correct_user_list.map((val: any) => {
      return `<div class="avatar-item" style="background-image:url(${val.img})"></div>`
    })
    return `<div class="point-popup-container">
            <div class="popup-title">${name}</div>
            <div class="popup-pic" style="background-image:url(${info.img})"></div>
            <div class="point-name">${info.content}</div>
            <div class="contributor-container">
              <div class="contributor-label">贡献者：</div>
              <div class="avatar-container">
                ${avatarElmStr}
              </div>
            </div>
            <div class="point-time">更新时间：${last_update_time}</div>
          </div>`
  }

  flyTo(latlng: L.LatLngExpression, zoom: number) {
    this.map.flyTo(latlng, zoom)
  }

  // 点击获取点的经纬度
  enableClickDebug() {
    this.map.on('click', workingLayer => {
      const cordinate = workingLayer.latlng
      console.log('cordinate', cordinate)
    })
  }
}
