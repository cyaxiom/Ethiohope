import bcrypt from 'bcryptjs';

/** Always generate a 6-digit numeric PIN for child login. */
export function generateSixDigitPin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashChildPin(plainPin: string): Promise<string> {
  return bcrypt.hash(plainPin, 10);
}
