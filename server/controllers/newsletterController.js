import Newsletter from '../models/Newsletter.js';

export const subscribe = async (req, res) => {
  try {
    const { email, source } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const normalized = String(email).trim().toLowerCase();

    // Check existing
    const existing = await Newsletter.findOne({ email: normalized });
    if (existing) return res.status(200).json({ message: 'Already subscribed' });

    const doc = await Newsletter.create({ email: normalized, source: source || 'footer' });
    return res.status(201).json({ message: 'Subscribed', id: doc._id });
  } catch (err) {
    console.error('[Newsletter] subscribe error', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const list = async (req, res) => {
  try {
    const items = await Newsletter.find().sort({ subscribedAt: -1 }).limit(100);
    res.json(items);
  } catch (err) {
    console.error('[Newsletter] list error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
