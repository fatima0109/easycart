import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  imageURL: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);