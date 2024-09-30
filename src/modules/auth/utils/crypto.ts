import { randomBytes } from 'crypto';

export function generateRandomCode(): string {
  return randomBytes(3).toString('hex'); // Tạo mã ngẫu nhiên 6 ký tự
}
