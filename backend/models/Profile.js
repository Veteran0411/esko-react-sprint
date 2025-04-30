import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email']
  },
  phoneNo: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  pic: {
    type: String,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  funFact: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  role: {
    type: String,
    required: true
  },
  joiningDate: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Profile', profileSchema);