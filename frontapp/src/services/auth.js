const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  async register({ name, email, password }) {
    const hashed = await bcrypt.hash(password, 12);
    return User.create({ 
      name, 
      email: email.toLowerCase().trim(), 
      password: hashed 
    });
  },

  async login(email, password) {
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    
    if (!user) throw new Error('User not found');
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid password');
    
    return user;
  }
};