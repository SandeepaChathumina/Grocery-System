import mongoose from 'mongoose';

const deliveryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  }
});

const deliverySchema = new mongoose.Schema({
  deliveryId: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true
    }
  },
  items: [deliveryItemSchema],
  route: {
    from: {
      type: String,
      required: true,
      trim: true
    },
    to: {
      type: String,
      required: true,
      trim: true
    },
    distance: Number,
    estimatedDuration: String
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  deliveryStatus: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Completed', 'Pending'],
    default: 'Pending'
  },
  specialRequests: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Generate unique delivery ID before saving
deliverySchema.pre('save', async function(next) {
  if (!this.deliveryId) {
    const count = await mongoose.models.Delivery.countDocuments();
    this.deliveryId = `DEL${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export default mongoose.model('Delivery', deliverySchema);