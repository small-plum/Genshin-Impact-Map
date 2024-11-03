<script setup lang="ts">
import { MapManager } from '@/js/map-manager'
import { onMounted } from 'vue'
import FilterHeader from '@/components/FilterHeader.vue'
import LocationBtn from '@/components/LocationBtn.vue'
import SelectedArea from '@/components/SelectedArea.vue'
import FilterMain from '@/components/FilterMain.vue'
// 初始化
onMounted(() => {
  console.log('the components is now mounted.')
  init()
})

function init() {
  const mapManager = new MapManager('map')
  // 显示地名
  const markerList = [
    {
      lat: -99.96875,
      lng: 125.71875,
      areaName: '碧水源',
    },
    {
      lat: -88.125,
      lng: 139.40675,
      areaName: '苍风高地',
    },
  ]

  mapManager.renderAreaName(markerList)

  // 显示标点
  const pointMarkerList = [
    {
      lat: -90.5625,
      lng: 144.65626,
      iconId: 1,
    },
    {
      lat: -99.53125,
      lng: 131.65626,
      iconId: 1,
    },
  ]
  mapManager.renderPoints(pointMarkerList)

  // 调用点击打印坐标的代码
  mapManager.enableClickDebug()
}
</script>

<template>
  <div class="home-view">
    <!-- 地图 -->
    <div class="map-layer" id="map"></div>

    <!-- UI -->
    <div class="ui-layer">
      <div class="filter-container">
        <div class="filter-content">
          <div class="close-btn">
            <div class="close-icon"></div>
          </div>
          <LocationBtn />
          <SelectedArea />
          <FilterHeader />
          <div class="search-container">
            <div class="search-icon"></div>
            <div class="search-tip">搜索</div>
          </div>
          <FilterMain />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-view {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.map-layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.ui-layer {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 2;
  .filter-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 415px;
    height: 100%;
    padding: 20px;
    .filter-content {
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      background-color: #3b4354;
      width: 100%;
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      .close-btn {
        position: absolute;
        top: 32px;
        right: -44px;
        width: 64px;
        height: 40px;
        background-image: url('../assets/images/ui/close-bg.png');
        background-size: cover;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding-left: 18px;
        .close-icon {
          width: 24px;
          height: 24px;
          background-size: cover;
          background-image: url('../assets/images/ui/close-icon.png');
        }
      }
      .search-container {
        width: 355px;
        height: 30px;
        display: flex;
        align-items: center;
        background-color: #323947;
        font-size: 12px;
        color: #9b9c9f;
        border-radius: 22px;
        padding-left: 10px;
        margin: 10px;
        .search-icon {
          width: 16px;
          height: 16px;
          background-image: url('../assets//images/ui/search-icon.png');
          background-size: cover;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
