<script setup lang="ts">
import { EventManager } from '@/js/event-manager'
import { globalDataInst } from '@/js/global-data'
import type { GuideUIItem } from '@/js/map-manager'
import { ref } from 'vue'

const guideUIAry = ref<GuideUIItem[]>([])

EventManager.on('RenderMapGuideUI', onRenderMapGuideUI)

function onRenderMapGuideUI(data: GuideUIItem[]) {
  guideUIAry.value = data
}

// 指示箭头的方向
function calcBgRotation(item: any) {
  const rotate = Math.PI - item.angle
  return `rotate(${rotate}rad)`
}
// 计算屏幕外标识位置
function calcOffsetStyle(item: any) {
  const { innerWidth, innerHeight } = window
  const screenAngle = Math.atan(innerHeight / innerWidth)
  const boundWidth = innerWidth - 100
  const boundHeight = innerHeight - 100

  const { angle } = item
  const marginTopSlope = angle > 0 ? -1 : 1
  const marginLeftSlope = Math.abs(angle) < Math.PI / 2 ? 1 : -1

  let marginLeft
  let marginTop

  if (
    Math.abs(angle) > screenAngle &&
    Math.abs(angle) < Math.PI - screenAngle
  ) {
    marginTop = (marginTopSlope * boundHeight) / 2
    marginLeft = marginLeftSlope * Math.abs(marginTop / Math.tan(angle))
  } else {
    marginLeft = (marginLeftSlope * boundWidth) / 2
    marginTop = marginTopSlope * Math.abs(marginLeft * Math.tan(angle))
  }
  return { marginLeft: `${marginLeft}px`, marginTop: `${marginTop}px` }
}

function onGuideMarkerClick(item: any) {
  globalDataInst.mapManager.flyTo(item)
}
</script>

<template>
  <div class="guide-marker-ui">
    <div
      class="guide-marker-item"
      v-for="(item, index) in guideUIAry"
      :key="index"
      :style="calcOffsetStyle(item)"
      @click="onGuideMarkerClick(item)"
    >
      <div class="marker-bg" :style="{ transform: calcBgRotation(item) }">
        <div class="arrow-icon"></div>
      </div>
      <div class="marker-img-container">
        <img :src="item.icon" alt="" class="item-icon" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.guide-marker-ui {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  pointer-events: none;
  .guide-marker-item {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 53px;
    height: 53px;
    cursor: pointer;
    .marker-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.5);
      border: 1px solid hsla(0, 0%, 100%, 0.3);
      .arrow-icon {
        position: absolute;
        left: -19px;
        top: 15px;
        width: 19px;
        height: 16px;
        background-image: url('../assets/images/ui/guide-arrow.png');
        background-size: cover;
      }
    }
    .marker-img-container {
      position: relative;
      z-index: 2;
      width: 48px;
      height: 48px;
      .item-icon {
        width: 100%;
      }
    }
  }
}
</style>
