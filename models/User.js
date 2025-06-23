const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [4, 'Username must be at least 4 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  accountLocked: {
    type: Boolean,
    default: false
  },
  lockUntil: {
    type: Date,
    default: null
  },
  refreshToken: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to handle failed login attempts
UserSchema.methods.registerLoginFailure = function() {
  this.failedLoginAttempts += 1;
  
  // Lock the account after 5 failed attempts
  if (this.failedLoginAttempts >= 5 && !this.accountLocked) {
    this.accountLocked = true;
    // Lock for 30 minutes
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
  }
  return this.save();
};

// Method to reset failed login attempts
UserSchema.methods.resetLoginAttempts = function() {
  this.failedLoginAttempts = 0;
  this.accountLocked = false;
  this.lockUntil = null;
  return this.save();
};

const User = mongoose.model('User', UserSchema);

module.exports = User;