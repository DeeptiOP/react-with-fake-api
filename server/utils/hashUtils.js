import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};
