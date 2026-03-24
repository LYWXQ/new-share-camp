const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { Item, User } = require('../models');
const { Op } = require('sequelize');

// 获取物品列表
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, keyword, sort = 'newest' } = req.query;
    const offset = (page - 1) * limit;
    
    const where = { status: 'available' };
    
    if (category) {
      where.category = category;
    }
    
    if (keyword) {
      where.title = { [Op.like]: `%${keyword}%` };
    }
    
    const order = [];
    if (sort === 'newest') {
      order.push(['createdAt', 'DESC']);
    } else if (sort === 'price_asc') {
      order.push(['price', 'ASC']);
    } else if (sort === 'price_desc') {
      order.push(['price', 'DESC']);
    }
    
    const { count, rows: items } = await Item.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar', 'creditScore']
      }],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      items,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get items', error: error.message });
  }
});

// 获取我的物品列表
router.get('/mine', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;
    
    const where = { userId };
    
    if (status) {
      where.status = status;
    }
    
    const { count, rows: items } = await Item.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar', 'creditScore']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      items,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get my items', error: error.message });
  }
});

// 获取物品详情
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar', 'creditScore', 'isVerified']
      }]
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // 增加浏览次数
    await item.update({ viewCount: item.viewCount + 1 });
    
    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get item', error: error.message });
  }
});

// 发布物品
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, images, price, deposit, availableTime, location } = req.body;
    const userId = req.user.id;
    
    const item = await Item.create({
      title,
      description,
      category,
      images: images || [],
      price,
      deposit,
      availableTime: availableTime || {},
      location,
      userId,
      status: 'available'
    });
    
    res.status(201).json({
      message: 'Item created successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
});

// 更新物品
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (item.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }
    
    const { title, description, category, images, price, deposit, availableTime, location, status } = req.body;
    
    await item.update({
      title: title || item.title,
      description: description || item.description,
      category: category || item.category,
      images: images || item.images,
      price: price || item.price,
      deposit: deposit || item.deposit,
      availableTime: availableTime || item.availableTime,
      location: location || item.location,
      status: status || item.status
    });
    
    res.json({
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
});

// 删除物品
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (item.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }
    
    await item.destroy();
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
});

module.exports = router;