<template>
  <view class="container">
    <view class="chat-header">
      <image class="avatar" :src="otherUser?.avatar || '/static/default-avatar.png'" mode="aspectFill" />
      <text class="chat-title">{{ otherUser?.username || '聊天' }}</text>
    </view>
    <scroll-view
      class="chat-content"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      @scrolltoupper="loadMoreMessages"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view v-if="isLoadingMore" class="loading-more">
        <text class="loading-text">加载中...</text>
      </view>
      <view
        v-for="msg in messageList"
        :key="msg.id"
        class="message"
        :class="{ 'sent': msg.senderId === currentUserId, 'received': msg.senderId !== currentUserId }"
      >
        <image
          v-if="msg.senderId !== currentUserId"
          class="message-avatar"
          :src="otherUser?.avatar || '/static/default-avatar.png'"
          mode="aspectFill"
        />
        <image
          v-else
          class="message-avatar"
          :src="currentUser?.avatar || '/static/default-avatar.png'"
          mode="aspectFill"
        />
        <view class="message-content">
          <view class="message-bubble">
            <text class="message-text">{{ msg.content }}</text>
          </view>
          <text class="message-time">{{ formatTime(msg.createdAt) }}</text>
        </view>
      </view>
    </scroll-view>
    <view class="chat-input">
      <input
        class="input"
        placeholder="输入消息..."
        v-model="messageText"
        @confirm="handleSendMessage"
      />
      <button class="send-button" @click="handleSendMessage" :disabled="isSending">
        {{ isSending ? '发送中...' : '发送' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { getChatHistory, sendMessage, type Message } from '@/api/messages';
import { getUserProfile } from '@/api/users';

// 当前用户 ID（从本地存储获取）
const currentUserId = ref<number>(uni.getStorageSync('userInfo')?.id || 0);
const currentUser = ref<{ avatar?: string }>({});

// 对方用户信息
const otherUserId = ref<number>(0);
const otherUser = ref<{ id?: number; username?: string; avatar?: string }>({});

// 消息列表
const messageList = ref<Message[]>([]);
const messageText = ref('');
const isSending = ref(false);
const isLoadingMore = ref(false);
const isRefreshing = ref(false);
const scrollTop = ref(0);

// 分页参数
const page = ref(1);
const limit = 20;
const hasMore = ref(true);

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 获取聊天记录
const fetchChatHistory = async (isLoadMore = false) => {
  if (!otherUserId.value) return;

  if (isLoadMore) {
    isLoadingMore.value = true;
  }

  try {
    const res = await getChatHistory(otherUserId.value, {
      page: page.value,
      limit
    });

    const messages = res.messages || [];
    
    if (isLoadMore) {
      // 加载更多时，将新数据添加到列表前面
      messageList.value = [...messages, ...messageList.value];
    } else {
      messageList.value = messages;
      // 滚动到底部
      scrollToBottom();
    }

    // 更新分页信息
    hasMore.value = res.pagination.page < res.pagination.totalPages;

    // 获取对方用户信息（从第一条消息中获取）
    if (messages.length > 0 && !otherUser.value.username) {
      const firstMsg = messages[0];
      const otherId = firstMsg.senderId === currentUserId.value ? firstMsg.receiverId : firstMsg.senderId;
      if (firstMsg.sender && firstMsg.sender.id !== currentUserId.value) {
        otherUser.value = firstMsg.sender;
      }
    }
  } catch (error) {
    console.error('获取聊天记录失败:', error);
    uni.showToast({ title: '获取聊天记录失败', icon: 'none' });
  } finally {
    isLoadingMore.value = false;
    isRefreshing.value = false;
  }
};

// 加载更多历史消息
const loadMoreMessages = () => {
  if (!hasMore.value || isLoadingMore.value) return;
  page.value++;
  fetchChatHistory(true);
};

// 下拉刷新
const onRefresh = () => {
  isRefreshing.value = true;
  page.value = 1;
  hasMore.value = true;
  fetchChatHistory();
};

// 发送消息
const handleSendMessage = async () => {
  if (!messageText.value.trim()) {
    uni.showToast({ title: '请输入消息内容', icon: 'none' });
    return;
  }

  if (!otherUserId.value) {
    uni.showToast({ title: '无法发送消息', icon: 'none' });
    return;
  }

  isSending.value = true;
  const content = messageText.value.trim();

  try {
    const res = await sendMessage({
      receiverId: otherUserId.value,
      content: content,
      type: 'chat'
    });

    // 添加新消息到列表
    messageList.value.push(res.messageData);
    messageText.value = '';

    // 滚动到底部
    scrollToBottom();
  } catch (error) {
    console.error('发送消息失败:', error);
    uni.showToast({ title: '发送失败，请重试', icon: 'none' });
  } finally {
    isSending.value = false;
  }
};

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    const query = uni.createSelectorQuery().in(getCurrentInstance()?.proxy);
    query.select('.chat-content').boundingClientRect((rect: any) => {
      if (rect) {
        scrollTop.value = rect.height + 9999;
      }
    }).exec();
  });
};

// 获取当前用户信息
const fetchCurrentUser = async () => {
  try {
    const userInfo = uni.getStorageSync('userInfo');
    if (userInfo) {
      currentUserId.value = userInfo.id;
      currentUser.value = userInfo;
    }
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
  }
};

// 获取对方用户信息
const fetchOtherUserInfo = async () => {
  if (!otherUserId.value) return;
  try {
    const res = await getUserProfile(otherUserId.value);
    if (res.user) {
      otherUser.value = res.user;
    }
  } catch (error) {
    console.error('获取对方用户信息失败:', error);
  }
};

import { getCurrentInstance } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

onLoad((options: any) => {
  const { userId, username, avatar } = options;

  if (userId) {
    otherUserId.value = parseInt(userId as string);
    if (username) otherUser.value.username = username as string;
    if (avatar) otherUser.value.avatar = avatar as string;

    fetchCurrentUser();
    fetchChatHistory();
    // 如果没有从参数获取到用户信息，则调用 API 获取
    if (!username) {
      fetchOtherUserInfo();
    }
  } else {
    uni.showToast({ title: '参数错误', icon: 'none' });
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.chat-header {
  background-color: #ffffff;
  padding: 24rpx;
  border-bottom: 2rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.chat-header .avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}

.chat-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.chat-content {
  flex: 1;
  padding: 16rpx;
  overflow-y: auto;
}

.loading-more {
  text-align: center;
  padding: 20rpx;
}

.loading-text {
  font-size: 24rpx;
  color: #999999;
}

.message {
  margin-bottom: 24rpx;
  display: flex;
  align-items: flex-start;
  max-width: 80%;
}

.message.received {
  align-self: flex-start;
  flex-direction: row;
}

.message.sent {
  align-self: flex-end;
  flex-direction: row-reverse;
  margin-left: auto;
}

.message-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin: 0 16rpx;
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message.sent .message-content {
  align-items: flex-end;
}

.message.received .message-content {
  align-items: flex-start;
}

.message-bubble {
  padding: 20rpx;
  border-radius: 16rpx;
  max-width: 500rpx;
  word-break: break-all;
}

.message.received .message-bubble {
  background-color: #ffffff;
  border-bottom-left-radius: 4rpx;
}

.message.sent .message-bubble {
  background-color: #007aff;
  border-bottom-right-radius: 4rpx;
}

.message.received .message-text {
  color: #333333;
}

.message.sent .message-text {
  color: #ffffff;
}

.message-text {
  font-size: 28rpx;
  line-height: 40rpx;
}

.message-time {
  font-size: 20rpx;
  color: #999999;
  margin-top: 8rpx;
}

.chat-input {
  display: flex;
  padding: 16rpx;
  background-color: #ffffff;
  border-top: 2rpx solid #f0f0f0;
  align-items: center;
}

.input {
  flex: 1;
  border: 2rpx solid #e5e5e5;
  border-radius: 24rpx;
  padding: 16rpx 24rpx;
  font-size: 28rpx;
  margin-right: 16rpx;
  background-color: #f5f5f5;
}

.send-button {
  width: 120rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background-color: #007aff;
  color: #ffffff;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.send-button[disabled] {
  background-color: #cccccc;
}
</style>
