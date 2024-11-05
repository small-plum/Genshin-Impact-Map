import L from 'leaflet'
import { valid } from 'mockjs'

interface AreaNameConfig {
  lat: number
  lng: number
  name: string
  children: any[]
}
interface pointConfig {
  lat: number
  lng: number
  iconId: number
}

export class MapManager {
  private map: L.Map
  private areaNameLayerGroup: L.LayerGroup | undefined
  private pointLayerGroup: L.LayerGroup | undefined
  private mapAnchorList: AreaNameConfig[] = []
  private prevZoom = 0

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
        this.prevZoom = this.map.getZoom()
      }
      this.renderAreaName()
    })
  }

  setMapAnchorList(configList: AreaNameConfig[]) {
    this.mapAnchorList = configList
  }

  // 渲染地名函数
  renderAreaName() {
    this.areaNameLayerGroup?.clearLayers()

    let markers: L.Marker[] = []
    if (this.map.getZoom() >= 6) {
      this.mapAnchorList.forEach(val => {
        let childrenList: L.Marker[] = []
        childrenList = val.children.map(this.getAreaNameMarkerItem)
        markers = markers.concat(childrenList)
      })
    } else {
      markers = this.mapAnchorList.map(this.getAreaNameMarkerItem)
    }

    this.areaNameLayerGroup = L.layerGroup(markers)
    this.areaNameLayerGroup.addTo(this.map)
  }

  getAreaNameMarkerItem(config: AreaNameConfig) {
    const { lat = 0, lng = 0, name } = config // 对象解构赋值
    return L.marker(L.latLng(lat, lng), {
      icon: L.divIcon({
        className: 'map-marker-item',
        html: `<div class="area-mark-item">${name}</div>`,
      }),
    })
  }

  renderPoints(pointList: pointConfig[]) {
    const pointMarkers = pointList.map(val => {
      const { lat, lng, iconId } = val // 对象解构赋值
      const iconUrl = `images/map-icon/${iconId}.png`
      const marker = L.marker(L.latLng(lat, lng), {
        icon: L.divIcon({
          className: 'map-point-item',
          html: `<div class="point-item-container">
                <div class="point-pic" style="background-image: url(${iconUrl})"></div>
              </div>`,
        }),
      })
      return marker
    })

    this.pointLayerGroup = L.layerGroup(pointMarkers)
    this.pointLayerGroup.addTo(this.map)
  }

  enableClickDebug() {
    this.map.on('click', workingLayer => {
      const cordinate = workingLayer.latlng
      console.log('cordinate', cordinate)
    })
  }
}
