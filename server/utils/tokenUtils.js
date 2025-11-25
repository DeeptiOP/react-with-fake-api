import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'your_secret_key_change_this';
const EXPIRE = process.env.JWT_EXPIRE || '7d';

export const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    SECRET,
    { expiresIn: EXPIRE }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
