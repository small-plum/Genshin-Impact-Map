<script setup lang="ts">
import { getMapAnchorList } from '@/js/api'
import { onMounted, ref } from 'vue'

const mapAnchorList = ref<any[]>([])

onMounted(() => {
  init()
})

async function init() {
  const res = await getMapAnchorList()
  mapAnchorList.value = res.data
  console.log(res.data)
}
</script>

<template>
  <div class="location-btn">
    <div class="location-icon"></div>
    <div class="location-content">
      <div class="location-title">快速定位</div>
      <div class="content-areas">
        <div class="area-item" v-for="item in mapAnchorList" :key="item.id">
          <div class="area-parent">
            <div class="parent-icon"></div>
            <div class="parent-name">{{ item.name }}</div>
          </div>
          <div
            class="area-child"
            v-for="child in item.children"
            :key="child.id"
          >
            {{ child.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.location-btn {
  position: absolute;
  top: 84px;
  right: -30px;
  width: 40px;
  height: 40px;
  background-color: rgba(50, 57, 71, 0.8);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    .location-content {
      visibility: visible;
    }
  }
  .location-icon {
    width: 24px;
    height: 24px;
    background-image: url('../assets/images/ui/location-btn.png');
    background-size: cover;
  }
  .location-content {
    position: absolute;
    left: 60px;
    top: 0;
    background: #3b4354;
    border-radius: 12px;
    visibility: hidden;
    transition: all 0.5s;
    .location-title {
      width: 192px;
      font-size: 16px;
      color: #d3bc8e;
      padding: 12px;
      border-bottom: 1px solid rgba(86, 97, 120, 0.2);
    }
    .content-areas {
      height: 500px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .area-item {
        .area-parent {
          display: flex;
          align-items: center;
          height: 48px;
          padding-left: 15px;
          &:hover {
            .parent-icon {
              background-image: url('../assets/images/ui/location-icon-h.png');
            }
            .parent-name {
              color: #ece5d8;
            }
          }
          .parent-icon {
            width: 12px;
            height: 12px;
            background-image: url('../assets/images/ui/location-icon-n.png');
            background-size: cover;
            margin-right: 5px;
          }
          .parent-name {
            color: #d3bc8e;
            font-size: 14px;
          }
        }
        .area-child {
          display: flex;
          align-items: center;
          padding-left: 32px;
          height: 48px;
          color: hsla(39, 34%, 89%, 0.75);
          &:hover {
            color: #ece5d8;
          }
        }
      }
    }
  }
}
</style>
