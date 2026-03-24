/**
 * 消息通知相关 API
 */
import { get, post, put } from '@/utils/request'
import type { PaginationData } from './types'

// 消息类型
type MessageType = 'system' | 'chat'

// 消息状态
type MessageStatus = 'unread' | 'read'

// 消息信息接口
export interface Message {
  id: number
  senderId: number
  receiverId: number
  type: MessageType
  content: string
  status: MessageStatus
  relatedId?: number
  relatedType?: string
  createdAt: string
  sender?: UserInfo
}

// 用户信息（简版）
interface UserInfo {
  id: number
  username: string
  avatar?: string
}

// 发送消息参数
export interface SendMessageParams {
  receiverId: number
  content: string
  type?: MessageType
  relatedId?: number
  relatedType?: string
}

/**
 * 获取消息列表
 */
export const getMessageList = (params?: { page?: number; limit?: number; type?: MessageType }): Promise<PaginationData<Message>> => {
  return get<PaginationData<Message>>('/messages', params)
}

/**
 * 获取与某个用户的聊天记录
 */
export const getChatHistory = (userId: number, params?: { page?: number; limit?: number }): Promise<PaginationData<Message>> => {
  return get<PaginationData<Message>>(`/messages/chat/${userId}`, params)
}

/**
 * 发送消息
 */
export const sendMessage = (data: SendMessageParams): Promise<{ message: string; messageData: Message }> => {
  return post('/messages', data)
}

/**
 * 标记消息为已读
 */
export const markAsRead = (messageId: number): Promise<{ message: string }> => {
  return put(`/messages/${messageId}/read`)
}

/**
 * 标记所有消息为已读
 */
export const markAllAsRead = (): Promise<{ message: string }> => {
  return put('/messages/read-all')
}

/**
 * 获取未读消息数
 */
export const getUnreadCount = (options?: any): Promise<{ count: number }> => {
  return get('/messages/unread/count', undefined, options)
}

/**
 * 删除消息
 */
export const deleteMessage = (messageId: number): Promise<{ message: string }> => {
  return put(`/messages/${messageId}/delete`)
}
