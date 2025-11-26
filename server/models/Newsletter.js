import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subscribedAt: { type: Date, default: Date.now },
  source: { type: String, default: 'footer' },
});

const Newsletter = mongoose.model('Newsletter', NewsletterSchema);

export default Newsletter;
