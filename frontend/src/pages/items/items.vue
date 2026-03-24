<template>
  <view class="items-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="icon-search">🔍</text>
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="搜索闲置物品"
          @confirm="handleSearch"
        />
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-bar">
      <scroll-view class="category-scroll" scroll-x>
        <view 
          class="filter-item" 
          v-for="(cat, index) in categories" 
          :key="index"
          :class="{ active: currentCategory === cat }"
          @click="selectCategory(cat)"
        >
          {{ cat }}
        </view>
      </scroll-view>
      <view class="sort-btn" @click="showSortOptions">
        <text>{{ currentSort.label }}</text>
        <text class="arrow">▼</text>
      </view>
    </view>

    <!-- 物品列表 -->
    <scroll-view 
      class="items-scroll" 
      scroll-y 
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="items-grid">
        <view 
          class="item-card" 
          v-for="item in items" 
          :key="item.id"
          @click="goToDetail(item.id)"
        >
          <image class="item-image" :src="getImageUrl(item.images?.[0])" mode="aspectFill" />
          <view class="item-info">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-desc">{{ item.description || '暂无描述' }}</text>
            <view class="item-meta">
              <text class="item-price">¥{{ item.price }}/天</text>
              <text class="item-deposit">押金¥{{ item.deposit }}</text>
            </view>
            <view class="item-user">
              <image class="user-avatar" :src="item.user?.avatar || '/static/logo.png'" />
              <text class="user-name">{{ item.user?.username || '未知用户' }}</text>
              <text class="user-credit">信用{{ item.user?.creditScore || 100 }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-if="!hasMore && items.length > 0">
        <text>没有更多了</text>
      </view>
      <view class="empty" v-if="items.length === 0 && !loading">
        <image class="empty-icon" src="/static/logo.png" />
        <text class="empty-text">暂无物品</text>
      </view>
    </scroll-view>

    <!-- 排序选项弹窗 -->
    <view class="sort-popup" v-if="showSort" @click="closeSort">
      <view class="sort-content" @click.stop>
        <view 
          class="sort-item" 
          v-for="sort in sortOptions" 
          :key="sort.value"
          :class="{ active: currentSort.value === sort.value }"
          @click="selectSort(sort)"
        >
          {{ sort.label }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getItemList, getCategories, type Item } from '@/api/items'

const searchKeyword = ref('')
const currentCategory = ref('全部')
const categories = ref<string[]>(['全部', '图书', '电子产品', '运动器材', '生活用品', '服装', '其他'])

const sortOptions = [
  { label: '最新发布', value: 'newest' },
  { label: '价格从低到高', value: 'price_asc' },
  { label: '价格从高到低', value: 'price_desc' }
]
const currentSort = ref(sortOptions[0])
const showSort = ref(false)

const items = ref<Item[]>([])
const loading = ref(false)
const refreshing = ref(false)
const hasMore = ref(true)
const page = ref(1)
const limit = ref(10)

// 处理图片 URL
const getImageUrl = (url?: string) => {
  if (!url) return '/static/logo.png'
  if (url.startsWith('http')) return url
  return `http://localhost:3000${url}`
}

// 加载物品列表
const loadItems = async (isRefresh = false) => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const params = {
      page: page.value,
      limit: limit.value,
      category: currentCategory.value === '全部' ? undefined : currentCategory.value,
      keyword: searchKeyword.value || undefined,
      sort: currentSort.value.value as 'newest' | 'price_asc' | 'price_desc'
    }
    
    const res = await getItemList(params)
    const resItems = res.items || []
    
    if (isRefresh) {
      items.value = resItems
    } else {
      items.value = [...items.value, ...resItems]
    }
    
    // 判断是否还有更多数据
    hasMore.value = resItems.length === limit.value && page.value < res.pagination.totalPages
  } catch (error) {
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 加载分类列表
const loadCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = res
  } catch (error) {
    console.error('加载分类失败', error)
  }
}

onMounted(() => {
  loadCategories()
  loadItems()
})

const handleSearch = () => {
  page.value = 1
  items.value = []
  hasMore.value = true
  loadItems(true)
}

const selectCategory = (cat: string) => {
  currentCategory.value = cat
  page.value = 1
  items.value = []
  hasMore.value = true
  loadItems(true)
}

const showSortOptions = () => {
  showSort.value = true
}

const closeSort = () => {
  showSort.value = false
}

const selectSort = (sort: typeof sortOptions[0]) => {
  currentSort.value = sort
  showSort.value = false
  page.value = 1
  items.value = []
  hasMore.value = true
  loadItems(true)
}

const loadMore = () => {
  if (!hasMore.value || loading.value) return
  
  page.value++
  loadItems()
}

const onRefresh = () => {
  refreshing.value = true
  page.value = 1
  hasMore.value = true
  loadItems(true)
}

const goToDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/item-detail/item-detail?id=${id}`
  })
}
</script>

<style lang="scss">
.items-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 20rpx;
  background-color: #fff;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 32rpx;
  padding: 16rpx 24rpx;
}

.icon-search {
  font-size: 28rpx;
  margin-right: 12rpx;
  color: #999;
}

.search-input input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.filter-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 0 20rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.category-scroll {
  flex: 1;
  white-space: nowrap;
}

.filter-item {
  display: inline-block;
  padding: 12rpx 24rpx;
  margin-right: 16rpx;
  background-color: #f5f5f5;
  border-radius: 28rpx;
  font-size: 26rpx;
  color: #666;
}

.filter-item.active {
  background-color: #007aff;
  color: #fff;
}

.sort-btn {
  display: flex;
  align-items: center;
  padding: 12rpx 20rpx;
  font-size: 26rpx;
  color: #666;
}

.arrow {
  margin-left: 8rpx;
  font-size: 20rpx;
}

.items-scroll {
  flex: 1;
  padding: 20rpx;
}

.items-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.item-card {
  width: calc(50% - 10rpx);
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.item-image {
  width: 100%;
  height: 240rpx;
}

.item-info {
  padding: 16rpx;
}

.item-title {
  font-size: 28rpx;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8rpx;
}

.item-desc {
  font-size: 24rpx;
  color: #999;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.item-price {
  font-size: 32rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.item-deposit {
  font-size: 22rpx;
  color: #999;
}

.item-user {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  margin-right: 8rpx;
}

.user-name {
  font-size: 24rpx;
  color: #666;
  margin-right: 12rpx;
}

.user-credit {
  font-size: 20rpx;
  color: #52c41a;
  background-color: #f6ffed;
  padding: 2rpx 8rpx;
  border-radius: 4rpx;
}

.load-more,
.no-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 26rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.sort-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.sort-content {
  width: 100%;
  background-color: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 20rpx 0;
}

.sort-item {
  padding: 30rpx 40rpx;
  font-size: 30rpx;
  color: #333;
  text-align: center;
  border-bottom: 1rpx solid #f5f5f5;
}

.sort-item:last-child {
  border-bottom: none;
}

.sort-item.active {
  color: #007aff;
  font-weight: 500;
}
</style>
