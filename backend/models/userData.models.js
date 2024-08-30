const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define the User schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please use a valid phone number.'], // Example regex for a 10-digit phone number
  },
  url: {
    type: String,
    default: null,
    match: [/^https?:\/\/[^\s/$.?#].[^\s]*$/, 'Please use a valid URL.'],
  },
  username: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare a provided password with the stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate a JWT for the user
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, 'your_jwt_secret_key', { expiresIn: '1h' });
  return token;
};

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
