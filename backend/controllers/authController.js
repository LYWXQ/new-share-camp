const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

// 用户注册（仅普通用户可以注册）
const register = async (req, res) => {
  try {
    const { studentId, username, password } = req.body;

    if (!studentId || !username || !password) {
      return res.status(400).json({ message: '学号、用户名和密码不能为空' });
    }

    const existingStudentId = await User.findOne({ where: { studentId } });
    if (existingStudentId) {
      return res.status(400).json({ message: '该学号已被注册' });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: '该用户名已被使用' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      studentId,
      username,
      password: hashedPassword,
      creditScore: 100,
      isVerified: false,
      role: 'user'
    });

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: user.id,
        studentId: user.studentId,
        username: user.username,
        creditScore: user.creditScore,
        isVerified: user.isVerified,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: '注册失败', error: error.message });
  }
};

// 用户登录（支持学号和用户名登录）
const login = async (req, res) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.status(400).json({ message: '账号和密码不能为空' });
    }

    // 先按用户名查询
    let user = await User.findOne({ where: { username: account } });
    
    // 如果没找到，再按学号查询
    if (!user) {
      user = await User.findOne({ where: { studentId: account } });
    }

    if (!user) {
      return res.status(401).json({ message: '账号或密码错误' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '账号或密码错误' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ message: '账号已被禁用' });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        studentId: user.studentId,
        username: user.username,
        avatar: user.avatar,
        creditScore: user.creditScore,
        isVerified: user.isVerified,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '登录失败', error: error.message });
  }
};

// 获取当前用户信息
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user.id,
      studentId: user.studentId,
      username: user.username,
      avatar: user.avatar,
      phone: user.phone,
      email: user.email,
      creditScore: user.creditScore,
      isVerified: user.isVerified,
      role: user.role,
      status: user.status
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: '获取用户信息失败', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
