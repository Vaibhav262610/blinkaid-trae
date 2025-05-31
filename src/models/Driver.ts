import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please provide license number'],
    unique: true
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Please provide vehicle number']
  },
  vehicleType: {
    type: String,
    required: [true, 'Please provide vehicle type']
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience']
  },
  documents: {
    licenseImage: String,
    vehicleRegistration: String,
    insurance: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedAt: Date,
  rejectedAt: Date,
  rejectionReason: String
});

export default mongoose.models.Driver || mongoose.model('Driver', DriverSchema);