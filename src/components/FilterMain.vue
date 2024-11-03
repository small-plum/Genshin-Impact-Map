<script setup lang="ts">
import { getMapFilterTree } from '@/js/api'
import { ref, onMounted } from 'vue'

onMounted(() => {
  init()
})

async function init() {
  const res = await getMapFilterTree()
  console.log('asd', res)
}

const activeTypeIndex = ref(0)

function onTypeItemClick(index: number) {
  activeTypeIndex.value = index
}
</script>

<template>
  <div class="filter-main">
    <div class="filter-main-left">
      <div
        class="filter-type-item"
        :class="{ active: item === activeTypeIndex }"
        v-for="item in 20"
        :key="item"
        @click="onTypeItemClick(item)"
      >
        <div class="item-name">传送点</div>
        <div class="item-count">5</div>
      </div>
    </div>
    <div class="filter-main-right">
      <div class="filter-content-item" v-for="i in 10" :key="i">
        <div class="content-head">
          <div class="head-title">露天宝箱</div>
        </div>
        <div class="content-body">
          <div class="content-item" v-for="item in 5" :key="item">
            <div class="item-icon-container">
              <div
                class="icon-pic"
                :style="{
                  backgroundImage:
                    'url(https://uploadstatic.mihoyo.com/ys-obc/2020/09/08/75276545/35cf41aad7620ce6d5dc516defb967f7_7806440070871726330.png?x-oss-process=image%2Fresize%2Cw_85%2Fquality%2CQ_90%2Fformat%2Cwebp)',
                }"
              ></div>
              <div class="icon-count">1161</div>
            </div>
            <div class="content-item-name">普通宝箱</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.filter-main {
  display: flex;
  flex: 1;
  overflow: hidden;
  .filter-main-left {
    width: 97px;
    height: 100%;
    overflow-y: auto;
    background-color: #323947;
    padding-bottom: 56px;
    &::-webkit-scrollbar {
      display: none;
    }
    .filter-type-item {
      position: relative;
      display: flex;
      align-items: center;
      padding: 16px 6px;
      cursor: pointer;
      color: hsla(39, 34%, 89%, 0.75);
      &.active {
        background-image: url('../assets/images/ui/filter-item-dec.png'),
          url('../assets/images/ui/filter-item-dec2.png');
        background-size:
          5px 100%,
          24px 100%;
        background-position:
          0 0,
          5px 0;
        background-repeat: no-repeat;
        background-color: #3b4354;
        color: #d3bc8e;
        padding: 16px 10px;
        &:hover {
          color: #d3bc8e;
        }
      }
      &:hover {
        color: #ece5d8;
      }
      .item-name {
        font-size: 12px;
        line-height: 16px;
        font-weight: 400;
      }
      .item-count {
        position: absolute;
        top: 5px;
        right: 4px;
        border-radius: 6px;
        background-color: #3b4354;
        padding: 0 3px;
        line-height: 12px;
        font-size: 9px;
        color: #d3bc8e;
      }
    }
  }
  .filter-main-right {
    padding: 0 10px;
    flex: 1;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .filter-content-item {
      border-bottom: 1px solid rgba(74, 83, 102, 0.5);
      .content-head {
        padding: 16px 0 0 2px;
        .head-title {
          color: #d3bc8e;
          font-size: 14px;
        }
      }
      .content-body {
        margin-top: 14px;
        display: flex;
        flex-wrap: wrap;
        .content-item {
          cursor: pointer;
          margin-bottom: 15px;
          margin-right: 10px;
          &:nth-of-type(4n) {
            margin-right: 0;
          }
          .item-icon-container {
            position: relative;
            width: 57px;
            height: 57px;
            border-radius: 6px;
            background-color: #323947;
            .icon-pic {
              width: 100%;
              height: 100%;
              background-size: cover;
            }
            .icon-count {
              position: absolute;
              font-size: 10px;
              right: 0;
              bottom: 0;
              line-height: 13px;
              color: #9b9c9f;
              background-color: #323947;
              padding: 0 4px;
              border-radius: 6px 0 6px 0;
            }
          }
          .content-item-name {
            margin-top: 5px;
            font-size: 10px;
            color: hsla(39, 34%, 89%, 0.75);
            max-width: 57px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
