<template>
  <view class="my-items-container">
    <view class="filter-tabs">
      <view 
        class="tab-item" 
        :class="{ active: currentStatus === '' }"
        @click="selectStatus('')"
      >
        全部
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentStatus === 'available' }"
        @click="selectStatus('available')"
      >
        可租
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentStatus === 'rented' }"
        @click="selectStatus('rented')"
      >
        已租
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentStatus === 'offline' }"
        @click="selectStatus('offline')"
      >
        已下架
      </view>
    </view>

    <scroll-view 
      class="items-scroll" 
      scroll-y 
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="items-list">
        <view 
          class="item-card" 
          v-for="item in items" 
          :key="item.id"
        >
          <image class="item-image" :src="getImageUrl(item.images?.[0])" mode="aspectFill" @click="goToDetail(item.id)" />
          <view class="item-content">
            <view class="item-header">
              <text class="item-title" @click="goToDetail(item.id)">{{ item.title }}</text>
              <view class="item-status" :class="item.status">
                {{ getStatusText(item.status) }}
              </view>
            </view>
            <text class="item-desc" @click="goToDetail(item.id)">{{ item.description || '暂无描述' }}</text>
            <view class="item-meta">
              <text class="item-price">¥{{ item.price }}/天</text>
              <text class="item-time">{{ formatDate(item.createdAt) }}</text>
            </view>
            <view class="item-actions">
              <view class="action-btn edit-btn" @click.stop="editItem(item)">
                <text>编辑</text>
              </view>
              <view class="action-btn delete-btn" @click.stop="deleteItemHandler(item)">
                <text>删除</text>
              </view>
            </view>
          </view>
        </view>
      </view>

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
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMyItems, deleteItem, type Item } from '@/api/items'
import { formatItemStatus } from '@/utils/constants'

const currentStatus = ref('')
const items = ref<Item[]>([])
const loading = ref(false)
const refreshing = ref(false)
const hasMore = ref(true)
const page = ref(1)
const limit = ref(10)

const getImageUrl = (url?: string) => {
  if (!url) return '/static/logo.png'
  if (url.startsWith('http')) return url
  return `http://localhost:3000${url}`
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    available: '可租',
    rented: '已租',
    offline: '已下架'
  }
  return statusMap[status] || formatItemStatus(status)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const loadItems = async (isRefresh = false) => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const params = {
      page: page.value,
      limit: limit.value,
      status: currentStatus.value || undefined
    }
    
    const res = await getMyItems(params, { showLoading: false })
    const resItems = res.items || []
    
    if (isRefresh) {
      items.value = resItems
    } else {
      items.value = [...items.value, ...resItems]
    }
    
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

const selectStatus = (status: string) => {
  currentStatus.value = status
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

const editItem = (item: Item) => {
  uni.navigateTo({
    url: `/pages/publish/publish?id=${item.id}`
  })
}

const deleteItemHandler = (item: Item) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这个物品吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '删除中...' })
          await deleteItem(item.id)
          uni.showToast({ title: '删除成功', icon: 'success' })
          onRefresh()
        } catch (error) {
          uni.showToast({ title: '删除失败', icon: 'none' })
        } finally {
          uni.hideLoading()
        }
      }
    }
  })
}

onMounted(() => {
  loadItems()
})
</script>

<style lang="scss">
.my-items-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.filter-tabs {
  display: flex;
  background-color: #fff;
  padding: 20rpx;
  gap: 16rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: #666;
  border-radius: 8rpx;
  background-color: #f5f5f5;
}

.tab-item.active {
  background-color: #007aff;
  color: #fff;
}

.items-scroll {
  flex: 1;
  padding: 20rpx;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.item-card {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.item-image {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12rpx;
}

.item-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
  margin-right: 12rpx;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-status {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.item-status.available {
  background-color: #e6f7ff;
  color: #1890ff;
}

.item-status.rented {
  background-color: #fff7e6;
  color: #fa8c16;
}

.item-status.offline {
  background-color: #f5f5f5;
  color: #999;
}

.item-status.reviewing {
  background-color: #fff1f0;
  color: #ff4d4f;
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
}

.item-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff6b6b;
}

.item-time {
  font-size: 22rpx;
  color: #ccc;
}

.item-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
}

.action-btn {
  flex: 1;
  text-align: center;
  padding: 12rpx 0;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.edit-btn {
  background-color: #e6f7ff;
  color: #1890ff;
}

.delete-btn {
  background-color: #fff1f0;
  color: #ff4d4f;
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
</style>
