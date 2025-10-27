const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = 'riant123@gmail.com';
    const password = 'rian123';
    const username = 'riant123';

    let user = await User.findOne({ email });
    if (user) {
      console.log(`User with email ${email} already exists. Updating role to admin and password.`);
      user.role = 'admin';
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      console.log('User updated to admin.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashed,
      role: 'admin'
    });

    await user.save();
    console.log(`Admin user created: ${email} / ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err.message);
    process.exit(1);
  }
};

createAdmin();
