const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { Message, User } = require('../models');
const { Op } = require('sequelize');

// 获取消息列表
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type = 'all', page = 1, limit = 20 } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;
    
    const where = {};
    
    if (type === 'received') {
      where.receiverId = userId;
    } else if (type === 'sent') {
      where.senderId = userId;
    } else {
      where[Op.or] = [
        { receiverId: userId },
        { senderId: userId }
      ];
    }
    
    const messages = await Message.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      messages: messages.rows,
      pagination: {
        total: messages.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(messages.count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get messages', error: error.message });
  }
});

// 获取未读消息数量
router.get('/unread/count', authenticateToken, async (req, res) => {
  try {
    const count = await Message.count({
      where: {
        receiverId: req.user.id,
        isRead: false
      }
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get unread count', error: error.message });
  }
});

// 获取与某个用户的聊天记录
router.get('/chat/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    const messages = await Message.findAndCountAll({
      where: {
        [Op.or]: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // 标记消息为已读
    await Message.update(
      { isRead: true },
      {
        where: {
          senderId: userId,
          receiverId: currentUserId,
          isRead: false
        }
      }
    );
    
    res.json({
      messages: messages.rows,
      pagination: {
        total: messages.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(messages.count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get chat messages', error: error.message });
  }
});

// 发送消息
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { receiverId, content, type = 'text', relatedId, relatedType } = req.body;
    const senderId = req.user.id;
    
    // 检查接收者是否存在
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }
    
    // 不能给自己发消息
    if (senderId === parseInt(receiverId)) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }
    
    const message = await Message.create({
      senderId,
      receiverId,
      content,
      type,
      relatedId,
      relatedType,
      isRead: false
    });
    
    // 返回完整消息信息
    const fullMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'username', 'avatar']
        }
      ]
    });
    
    res.status(201).json({
      message: 'Message sent successfully',
      data: fullMessage
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

// 标记消息为已读
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // 只能标记发给自己的消息
    if (message.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }
    
    await message.update({ isRead: true });
    
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark message as read', error: error.message });
  }
});

// 删除消息 (支持PUT和DELETE)
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // 只能删除自己发送或接收的消息
    if (message.senderId !== req.user.id && message.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }
    
    await message.destroy();
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message', error: error.message });
  }
};

router.delete('/:id', authenticateToken, deleteMessage);
router.put('/:id/delete', authenticateToken, deleteMessage);

// 标记所有消息为已读
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Message.update(
      { isRead: true },
      {
        where: {
          receiverId: userId,
          isRead: false
        }
      }
    );
    
    res.json({ message: 'All messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark all as read', error: error.message });
  }
});

module.exports = router;
