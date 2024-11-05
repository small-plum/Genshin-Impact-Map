import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useHomeStore = defineStore('home', () => {
  const filterTree = ref<any[]>([])
  const selectedFilterItems = ref<any[]>([])
  const mapAnchorList = ref<any[]>([])

  watch(
    filterTree,
    () => {
      calSelectedFilterItems()
    },
    { deep: true },
  )

  function setMapAnchorList(data: any[]) {
    mapAnchorList.value = data
  }

  function setFilterTree(data: any[]) {
    filterTree.value = data
  }
  // 筛选选中的元素
  function calSelectedFilterItems() {
    let res: any[] = []
    for (let i = 0; i < filterTree.value.length; i++) {
      const item = filterTree.value[i]
      const activeItems = item.children.filter((child: any) => {
        return child.active
      })
      res = res.concat(activeItems)
    }
    selectedFilterItems.value = res
  }

  return {
    filterTree,
    setFilterTree,
    selectedFilterItems,
    mapAnchorList,
    setMapAnchorList,
  }
})
