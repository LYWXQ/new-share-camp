<template>
  <view class="container">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error" class="error-container">
      <text class="error-text">{{ error }}</text>
      <button class="retry-button" @click="loadItemDetail">重新加载</button>
    </view>

    <!-- 物品详情 -->
    <view v-else-if="item" class="item-detail">
      <!-- 图片轮播 -->
      <view class="image-swiper-container">
        <swiper class="image-swiper" :indicator-dots="true" :autoplay="false" :circular="true">
          <swiper-item v-for="(image, index) in item.images" :key="index">
            <image class="swiper-image" :src="getImageUrl(image)" mode="aspectFill" @error="onImageError" />
          </swiper-item>
        </swiper>
        <view v-if="!item.images || item.images.length === 0" class="no-image">
          <image class="placeholder-image" src="/static/logo.png" mode="aspectFill" />
        </view>
      </view>

      <!-- 物品基本信息 -->
      <view class="item-basic-info">
        <text class="item-title">{{ item.title }}</text>
        <view class="price-row">
          <text class="item-price">¥{{ item.price.toFixed(2) }}/天</text>
          <text class="item-deposit">押金 ¥{{ item.deposit.toFixed(2) }}</text>
        </view>
        <view class="item-meta">
          <text class="meta-item">{{ item.category }}</text>
          <text class="meta-item">{{ formatStatus(item.status) }}</text>
          <text class="meta-item">浏览 {{ item.viewCount }}</text>
        </view>
      </view>

      <!-- 发布者信息 -->
      <view v-if="item.user" class="owner-section">
        <view class="owner-header">
          <text class="section-title">发布者</text>
          <view v-if="item.user.isVerified" class="verified-badge">
            <text class="verified-text">已认证</text>
          </view>
        </view>
        <view class="owner-info">
          <image class="owner-avatar" :src="item.user.avatar || '/static/logo.png'" mode="aspectFill" />
          <view class="owner-detail">
            <text class="owner-name">{{ item.user.username }}</text>
            <view class="owner-credit">
              <text class="credit-label">信用分</text>
              <text class="credit-score">{{ item.user.creditScore }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 物品描述 -->
      <view class="item-description">
        <text class="section-title">物品描述</text>
        <text class="description-content">{{ item.description || '暂无描述' }}</text>
      </view>

      <!-- 物品规格 -->
      <view class="item-specs">
        <text class="section-title">物品信息</text>
        <view class="spec-item">
          <text class="spec-label">分类：</text>
          <text class="spec-value">{{ item.category || '未分类' }}</text>
        </view>
        <view class="spec-item">
          <text class="spec-label">状态：</text>
          <text class="spec-value">{{ formatStatus(item.status) }}</text>
        </view>
        <view v-if="item.location" class="spec-item">
          <text class="spec-label">位置：</text>
          <text class="spec-value">{{ item.location }}</text>
        </view>
        <view v-if="item.availableTime?.start || item.availableTime?.end" class="spec-item">
          <text class="spec-label">可借时间：</text>
          <text class="spec-value">{{ formatAvailableTime(item.availableTime) }}</text>
        </view>
        <view class="spec-item">
          <text class="spec-label">发布时间：</text>
          <text class="spec-value">{{ formatDate(item.createdAt) }}</text>
        </view>
      </view>

      <!-- 物品评价 -->
      <view class="item-reviews" v-if="reviews.length > 0 || reviewsLoading">
        <view class="reviews-header">
          <text class="section-title">用户评价</text>
          <text class="reviews-count" v-if="reviews.length > 0">({{ reviews.length }})</text>
        </view>
        
        <view v-if="reviewsLoading" class="reviews-loading">
          <text>加载中...</text>
        </view>
        
        <view v-else class="reviews-list">
          <view class="review-card" v-for="review in reviews" :key="review.id">
            <view class="review-header">
              <image class="reviewer-avatar" :src="review.reviewer?.avatar || '/static/logo.png'" mode="aspectFill" />
              <view class="reviewer-info">
                <text class="reviewer-name">{{ review.reviewer?.username }}</text>
                <view class="review-rating">
                  <text 
                    class="star" 
                    v-for="index in 5" 
                    :key="index"
                    :class="{ active: index <= review.rating }"
                  >★</text>
                </view>
              </view>
              <text class="review-time">{{ formatReviewTime(review.createdAt) }}</text>
            </view>
            <text class="review-content">{{ review.content }}</text>
            <view class="review-images" v-if="review.images && review.images.length > 0">
              <image 
                class="review-image" 
                v-for="(img, index) in review.images" 
                :key="index"
                :src="img" 
                mode="aspectFill"
                @click="previewReviewImage(img)"
              ></image>
            </view>
          </view>
        </view>
        
        <view class="no-reviews" v-if="!reviewsLoading && reviews.length === 0">
          <text>暂无评价</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="chat-button" @click="contactOwner">联系发布者</button>
        <button 
          class="borrow-button" 
          :class="{ 'disabled': !canBorrow }"
          :disabled="!canBorrow"
          @click="borrowItem"
        >
          {{ borrowButtonText }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getItemDetail, type Item } from '@/api/items'
import { createOrder, type CreateOrderParams } from '@/api/orders'
import { getItemReviews, type Review } from '@/api/reviews'
import { useAuthStore } from '@/stores/auth'
import { formatItemStatus, getBorrowButtonText, canBorrow as canBorrowItem } from '@/utils/constants'

const authStore = useAuthStore()

const showDatePicker = ref(false)
const orderForm = ref({
  startDate: '',
  endDate: '',
  note: ''
})

// 物品 ID
const itemId = ref<number>(0)
// 物品数据
const item = ref<Item | null>(null)
// 评价数据
const reviews = ref<Review[]>([])
// 加载状态
const loading = ref(false)
// 评价加载状态
const reviewsLoading = ref(false)
// 错误信息
const error = ref('')

// 计算属性：是否可以借用
const canBorrow = computed(() => {
  return item.value ? canBorrowItem(item.value.status) : false
})

// 计算属性：借用按钮文字
const borrowButtonText = computed(() => {
  return item.value ? getBorrowButtonText(item.value.status) : '立即借用'
})

// 获取图片 URL
const getImageUrl = (url: string): string => {
  if (!url) return '/static/logo.png'
  if (url.startsWith('http')) return url
  return `http://localhost:3000${url}`
}

// 图片加载失败处理
const onImageError = () => {
  console.log('图片加载失败')
}

// 格式化状态
const formatStatus = (status: string): string => {
  return formatItemStatus(status)
}

// 格式化可借时间
const formatAvailableTime = (time: { start?: string; end?: string }): string => {
  if (time.start && time.end) {
    return `${formatDate(time.start)} 至 ${formatDate(time.end)}`
  } else if (time.start) {
    return `从 ${formatDate(time.start)} 开始`
  } else if (time.end) {
    return `至 ${formatDate(time.end)} 结束`
  }
  return '随时可借'
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

// 格式化评价时间
const formatReviewTime = (time: string): string => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  } else if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

// 预览评价图片
const previewReviewImage = (url: string) => {
  uni.previewImage({
    urls: [url],
    current: url
  })
}

// 加载物品评价
const loadReviews = async () => {
  if (!itemId.value) return
  
  reviewsLoading.value = true
  
  try {
    const res = await getItemReviews(itemId.value, { page: 1, limit: 5 })
    reviews.value = res.data || []
  } catch (error) {
    console.error('获取物品评价失败:', error)
  } finally {
    reviewsLoading.value = false
  }
}

// 加载物品详情
const loadItemDetail = async () => {
  if (!itemId.value) {
    error.value = '物品ID无效'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await getItemDetail(itemId.value)
    if (res.item) {
      item.value = res.item
      // 加载评价
      await loadReviews()
    } else {
      error.value = '物品不存在'
    }
  } catch (err: any) {
    console.error('获取物品详情失败:', err)
    error.value = err.message || '获取物品详情失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 联系发布者
const contactOwner = () => {
  if (!item.value?.user) {
    uni.showToast({ title: '发布者信息不可用', icon: 'none' })
    return
  }
  if (!authStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }
  uni.navigateTo({ url: `/pages/chat/chat?userId=${item.value.user.id}` })
}

// 借用物品
const borrowItem = () => {
  if (!canBorrow.value) return
  if (!authStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }
  if (!item.value) return

  const today = new Date().toISOString().split('T')[0]
  
  uni.showModal({
    title: '借用信息',
    editable: true,
    placeholderText: '请输入备注信息（可选）',
    content: `请选择借用时间\n开始日期：\n结束日期：`,
    success: (modalRes) => {
      if (modalRes.confirm) {
        showDatePickerModal(today)
      }
    }
  })
}

const showDatePickerModal = (today: string) => {
  uni.showActionSheet({
    itemList: ['选择开始日期', '选择结束日期', '直接借用（今天起7天）'],
    success: async (actionRes) => {
      if (actionRes.tapIndex === 0) {
        uni.showToast({ title: '请使用日期选择器', icon: 'none' })
        showSimpleBorrowModal(today)
      } else if (actionRes.tapIndex === 1) {
        showSimpleBorrowModal(today)
      } else if (actionRes.tapIndex === 2) {
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + 7)
        orderForm.value.startDate = today
        orderForm.value.endDate = endDate.toISOString().split('T')[0]
        submitOrder()
      }
    }
  })
}

const showSimpleBorrowModal = (today: string) => {
  uni.showModal({
    title: '确认借用',
    content: `确定借用"${item.value?.title}"吗？\n默认借用7天`,
    success: async (res) => {
      if (res.confirm) {
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + 7)
        orderForm.value.startDate = today
        orderForm.value.endDate = endDate.toISOString().split('T')[0]
        await submitOrder()
      }
    }
  })
}

const submitOrder = async () => {
  try {
    uni.showLoading({ title: '提交中...' })
    const params: CreateOrderParams = {
      itemId: itemId.value,
      startDate: orderForm.value.startDate,
      endDate: orderForm.value.endDate,
      note: orderForm.value.note || undefined
    }
    await createOrder(params)
    uni.hideLoading()
    uni.showToast({ title: '借用申请已提交', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/orders/orders' })
    }, 1500)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '提交失败，请重试', icon: 'none' })
  }
}

// 页面加载
onLoad((options) => {
  const id = options?.id
  if (id) {
    itemId.value = parseInt(id, 10)
    loadItemDetail()
  } else {
    error.value = '缺少物品ID参数'
  }
})
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

/* 加载状态 */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999999;
}

.error-text {
  font-size: 28rpx;
  color: #ff4d4f;
  margin-bottom: 32rpx;
  text-align: center;
}

.retry-button {
  width: 240rpx;
  height: 72rpx;
  line-height: 72rpx;
  background-color: #007aff;
  color: #ffffff;
  font-size: 28rpx;
  border-radius: 36rpx;
}

/* 图片轮播 */
.image-swiper-container {
  position: relative;
  width: 100%;
  height: 600rpx;
  background-color: #f0f0f0;
}

.image-swiper {
  width: 100%;
  height: 100%;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.no-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-image {
  width: 200rpx;
  height: 200rpx;
  opacity: 0.5;
}

/* 物品基本信息 */
.item-basic-info {
  background-color: #ffffff;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.item-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 16rpx;
  display: block;
  line-height: 1.4;
}

.price-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 16rpx;
}

.item-price {
  font-size: 40rpx;
  color: #ff4d4f;
  font-weight: bold;
  margin-right: 24rpx;
}

.item-deposit {
  font-size: 24rpx;
  color: #666666;
}

.item-meta {
  display: flex;
  gap: 24rpx;
}

.meta-item {
  font-size: 24rpx;
  color: #999999;
  background-color: #f5f5f5;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
}

/* 发布者信息 */
.owner-section {
  background-color: #ffffff;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.owner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.verified-badge {
  background-color: #52c41a;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.verified-text {
  font-size: 20rpx;
  color: #ffffff;
}

.owner-info {
  display: flex;
  align-items: center;
}

.owner-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  background-color: #f0f0f0;
}

.owner-detail {
  flex: 1;
}

.owner-name {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 8rpx;
  display: block;
}

.owner-credit {
  display: flex;
  align-items: center;
}

.credit-label {
  font-size: 22rpx;
  color: #999999;
  margin-right: 8rpx;
}

.credit-score {
  font-size: 22rpx;
  color: #ff9500;
  font-weight: bold;
}

/* 物品描述 */
.item-description {
  background-color: #ffffff;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 16rpx;
  display: block;
}

.description-content {
  font-size: 26rpx;
  line-height: 1.8;
  color: #666666;
}

/* 物品规格 */
.item-specs {
  background-color: #ffffff;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.spec-item {
  display: flex;
  margin-bottom: 16rpx;
}

.spec-item:last-child {
  margin-bottom: 0;
}

.spec-label {
  font-size: 26rpx;
  color: #999999;
  width: 160rpx;
  flex-shrink: 0;
}

.spec-value {
  font-size: 26rpx;
  color: #333333;
  flex: 1;
}

/* 操作按钮 */
.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 24rpx;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.chat-button {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  background-color: #f0f0f0;
  color: #333333;
  font-size: 28rpx;
  border: none;
}

.borrow-button {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  background-color: #007aff;
  color: #ffffff;
  font-size: 28rpx;
  border: none;
}

.borrow-button.disabled {
  background-color: #cccccc;
  color: #ffffff;
}

/* 物品评价 */
.item-reviews {
  background-color: #ffffff;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.reviews-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.reviews-count {
  font-size: 24rpx;
  color: #999;
  margin-left: 8rpx;
}

.reviews-loading,
.no-reviews {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 26rpx;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.review-card {
  padding: 16rpx;
  background-color: #f9f9f9;
  border-radius: 12rpx;
}

.review-card .review-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.review-card .reviewer-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  margin-right: 12rpx;
}

.review-card .reviewer-info {
  flex: 1;
}

.review-card .reviewer-name {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 4rpx;
}

.review-card .review-rating {
  display: flex;
}

.review-card .review-rating .star {
  font-size: 22rpx;
  color: #ddd;
  margin-right: 2rpx;
}

.review-card .review-rating .star.active {
  color: #ffb800;
}

.review-card .review-time {
  font-size: 22rpx;
  color: #999;
}

.review-card .review-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  display: block;
  margin-bottom: 12rpx;
}

.review-card .review-images {
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
}

.review-card .review-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 8rpx;
}
</style>
