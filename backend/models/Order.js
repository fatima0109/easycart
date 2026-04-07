import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number
  }],
  totalPrice: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  orderStatus: { type: String, default: 'Processing' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);