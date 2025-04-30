import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  deadline: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  team: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    required: true,
    enum: ['completed', 'ongoing', 'pending']
  },
  techStack: [{
    type: String,
    trim: true
  }],
  projectManager: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isAssigned: {
    type: Boolean,
    default: false
  },
  assignedTo: [{
    type: String,
    trim: true
  }]
});

export default mongoose.model('Project', projectSchema);